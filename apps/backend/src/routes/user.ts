import { Bindings, Variables, answer, answerRequestSchema, newQuizRequestSchema } from "@repo/types/index";
import { Hono } from "hono";
import { quizzes, users } from "@repo/db/index";
import { generateQuiz } from "@repo/ai/index";
import { and, eq, desc, sql } from "drizzle-orm";
import { validateUser } from "../middleware/validateUser";
import { rateLimit } from "../middleware/rateLimit";
import axios from "axios";
import { headers } from "../utils/lemonSqueezy";
import { createCacheKey } from "../utils/cacheKey";

const CACHE_EXPIRY = 60 * 5; // 5 minutes in seconds
const user = new Hono<{ Bindings: Bindings, Variables: Variables }>();
const models = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash'
]

let currentModelIndex = 0

const selectModel = () => {
  const model = models[currentModelIndex]
  currentModelIndex = (currentModelIndex + 1) % models.length
  return model
}

user.use('*', validateUser)

user.get("/profile", async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')
    
    if (!user || !user.id || !user.email) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in." 
      }, 401);
    }

    // Create cache key for user profile
    const cacheKey = createCacheKey('profile', user.id);
    
    const cacheKV = await c.env.blitzq_kv.get(cacheKey)
    if (cacheKV) {
      console.log("Cache hit for profile data");
      return c.json(JSON.parse(cacheKV), 200);
    }

    const userData = await db.select().from(users).where(
      and(
        eq(users.id, user.id), 
        eq(users.email, user.email)
      )
    );

    if (!userData || !userData.length) {
      return c.json({
        success: false, 
        message: "User profile not found."
      }, 404);
    }

    const responseBody = {
      id: userData[0].id,
      email: userData[0].email,
      tier: userData[0].tier,
      quota: userData[0].quota,
      profileImg: userData[0].profileImg
    }

    const response = {
      success: true, 
      message: "Profile fetched successfully", 
      user: responseBody 
    };
  
    
    await c.env.blitzq_kv.put(cacheKey, JSON.stringify(response), {
      expirationTtl: CACHE_EXPIRY
    });

    return c.json(response, 200);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return c.json({ 
      success: false, 
      message: "Something went wrong. Please try again later." 
    }, 500);
  }
});

user.post('/createQuiz', rateLimit(5), async (c) => {
  const db = c.get('db')
  const user = c.get('user')
  const ai = c.get('ai')
  const lockKey = `quiz_lock:${user.id}`
  try {
    const requestBody = await c.req.json()
    const parsedBody = newQuizRequestSchema.safeParse(requestBody)
    if (!parsedBody.success) {
      return c.json({
        success: false, 
        message: "Invalid request body. Please check the input data."
      }, 400);
    }
    const body = parsedBody.data
    const userQuota = await db.select({ quota: users.quota }).from(users).where(
      and(
        eq(users.id, user.id), 
        eq(users.email, user.email)
      )
    )
    if (!userQuota || !userQuota.length || userQuota[0].quota <= 0) {
      return c.json({
        success: false, 
        message: "Quota exceeded. Please upgrade your plan."
      }, 403);
    }

    const alreadyLocked = await c.env.blitzq_kv.get(lockKey)
    if (alreadyLocked) {
      return c.json({
        success: false, 
        message: "Please wait a moment before generating another quiz."
      }, 429);
    }

    await c.env.blitzq_kv.put(lockKey, 'locked', { 
      expirationTtl: 90
    })

    console.log("Lock acquired for quiz generation")
    const model = selectModel()
    const quiz = await generateQuiz(model, ai, body.topic, body.difficulty)
    if (!quiz || !quiz.length) {
      return c.json({
        success: false, 
        message: "Failed to generate quiz. Please try again later."
      }, 500);
    }
    const jsonString = quiz.replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}');
    const cleanedJson = jsonString.slice(jsonStart, jsonEnd + 1);
    const jsonStringParsed = JSON.parse(cleanedJson)
    const quizTitle = jsonStringParsed.topic || body.topic

    const data = await db.transaction(async (tx : any) => {
      const result = await tx.execute(
        sql`SELECT * FROM users WHERE id = ${user.id} FOR UPDATE`
      )
      const userData = result.rows?.[0];
      if (!userData) {
        throw new Error("User not found", { cause: 404 });
      }
      if (!userData.quota) {
        throw new Error("Quota exceeded", { cause: 403 });
      }

      const insertedQuiz = await tx.insert(quizzes).values({
        title: quizTitle,
        submitted: false,
        quiz: cleanedJson,
        userId: user.id
      }).returning({ id: quizzes.id }).execute()

      const updatedUser = await tx.update(users).set({
        quota: userData.quota - 1
      }).where(eq(users.id, user.id)).returning({quota: users.quota}).execute()

      return {quizId: insertedQuiz[0].id, quota: updatedUser[0].quota}
    });

    const responseBody = {
      id: data.quizId,
      title: quizTitle,
      quota: data.quota
    }

    // Invalidate relevant caches after creating a new quiz
    const profileCacheKey = createCacheKey('profile', user.id);
    const quizzesCacheKey = createCacheKey('quizzes', user.id);
    const quizzesCacheUrl = new Request(`${c.env.BASE_URL}/cache/${quizzesCacheKey}`);
    await c.env.blitzq_kv.delete(profileCacheKey)
    
    c.executionCtx.waitUntil(Promise.all([
      caches.default.delete(quizzesCacheUrl)
    ]));

    return c.json({
      success: true, 
      quiz: responseBody,
      message: "Quiz created successfully."
    }, 201);

  } catch (error: any) {
    console.error("Create quiz error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to create quiz. Please try again later." 
    }, typeof error.cause === 'number' ? error.cause : 500);
  } finally {
    await c.env.blitzq_kv.delete(lockKey)
    console.log("Lock released for quiz generation")
  }
});

user.get('/quizzes', async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')
    const { limit, offset } = c.req.query()
    const limitValue = limit ? parseInt(limit as string) : 20
    const offsetValue = offset ? parseInt(offset as string) : 0
    
    if (!user || !user.id) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in" 
      }, 401);
    }

    const shouldGetFromCache = offsetValue === 0
    // Create cache key with pagination params
    const cacheKey = createCacheKey('quizzes', user.id);
    
    // Try to get data from cache first using Cloudflare's cache
    const cacheUrl = new Request(`${c.env.BASE_URL}/cache/${cacheKey}`);
    if (shouldGetFromCache) {
      const cachedResponse = await caches.default.match(cacheUrl);
      if (cachedResponse) {
        console.log("Cache hit for quizzes data");
        return new Response(cachedResponse.body, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const quizzesData = await db.select( {
      id: quizzes.id,
      title: quizzes.title
    } ).from(quizzes).where(
      and(
        eq(quizzes.userId, user.id)
      )
    ).orderBy(desc(quizzes.createdAt)).limit(limitValue).offset(offsetValue)

    if (!quizzesData || !quizzesData.length) {
      return c.json({
        success: true,
        quizzes: [],
        message: "No quizzes found."
        }, 200);
    }

    const response = {
      success: true, 
      quizzes: quizzesData,
      message: "Quizzes fetched successfully."
    };
    
    // Store in Cloudflare cache
    const responseToCache = new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `max-age=${CACHE_EXPIRY}`
      }
    });

    if (shouldGetFromCache) {
      c.executionCtx.waitUntil(caches.default.put(cacheUrl, responseToCache));
    }

    return c.json(response, 200);

  } catch (error: any) {
    console.error("Fetch quizzes error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to fetch quizzes. Please try again later." 
    }, 500);
  }
})

user.get('/quizzes/:id', async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')
    const { id } = c.req.param()
    
    if (!user || !user.id) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in." 
      }, 401);
    }

    // Create cache key for specific quiz
    const cacheKey = createCacheKey('quiz', user.id, id);
    
    // Try to get data from cache first using Cloudflare's cache
    const cacheUrl = new Request(`${c.env.BASE_URL}/cache/${cacheKey}`);

    const cachedResponse = await caches.default.match(cacheUrl);
    if (cachedResponse) {
      console.log("Cache hit for quiz data");
      return new Response(cachedResponse.body, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const quizData = await db.select().from(quizzes).where(
      and(
        eq(quizzes.userId, user.id), 
        eq(quizzes.id, id)
      )
    )

    if (!quizData || !quizData.length) {
      return c.json({
        success: false, 
        message: "Quiz not found."
      }, 404);
    }

    const response = {
      success: true, 
      quiz: quizData[0],
      message: "Quiz fetched successfully."
    };
    
    // Store in Cloudflare cache
    const responseToCache = new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `max-age=${CACHE_EXPIRY}`
      }
    });
    
    c.executionCtx.waitUntil(caches.default.put(cacheUrl, responseToCache));

    return c.json(response, 200);

  }
  catch (error: any) {
    console.error("Fetch quiz error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to fetch quiz. Please try again later." 
    }, 500);
  }
});

user.put('/quizzes/:id', rateLimit(), async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')
    const { id } = c.req.param()
    const {answer} = await c.req.json()
    const parsedBody = answerRequestSchema.safeParse(answer)
    if (!parsedBody.success) {
      return c.json({
        success: false, 
        message: "Invalid request body. Please check the input data."
      }, 400);
    }
    const body = parsedBody.data

    if (!user || !user.id) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in." 
      }, 401);
    }

    const quizData = await db.select().from(quizzes).where(
      and(
        eq(quizzes.userId, user.id), 
        eq(quizzes.id, id)
      )
    )

    if (!quizData || !quizData.length) {
      return c.json({
        success: false, 
        message: "Quiz not found."
      }, 404);
    }

    const topicPerformance = new Map<string, {total: number, correct: number}>();
// Populate the map with data from questions and answers
    quizData[0].quiz.questions.forEach((question: any, index: number) => {
      const subTopic = question.sub_topic;
      const answerData = body[index]; // Get the corresponding answer

      if (!topicPerformance.has(subTopic)) {
        topicPerformance.set(subTopic, { total: 0, correct: 0 });
      }

      const data = topicPerformance.get(subTopic)!;
      data.total += 1;
      if (answerData && answerData.isCorrect) {
        data.correct += 1;
      }
    });

    // Calculate performance score (percentage correct) for each topic
    const topicScores = Array.from(topicPerformance.entries()).map(([topic, data]) => {
      const score = data.total > 0 ? (data.correct / data.total) : 0;
      return { topic, score, questionCount: data.total };
    });

    // Find min and max scores (filtering out topics with too few questions if desired)
    const minScore = Math.min(...topicScores.map(t => t.score));
    const maxScore = Math.max(...topicScores.map(t => t.score));

    // Get weakest and strongest topics based on scores
    const weakTopics = topicScores
      .filter(t => t.score === minScore)
      .map(t => t.topic);

    const strongTopics = topicScores
      .filter(t => t.score === maxScore)
      .map(t => t.topic);

    const answerBody: answer = {
      answer: body,
      totalTime: body.reduce((acc: number, curr: any) => acc + curr.timeTaken, 0),
      avgTime: body.reduce((acc: number, curr: any) => acc + curr.timeTaken, 0) / body.length,
      correctAnswers: body.filter((item: any) => item.isCorrect).length,
      wrongAnswers: body.filter((item: any) => !item.isCorrect).length,
      weakTopics: [],
      strongTopics: [] 
    }

    if (minScore === maxScore) {
      // All topics have the same performance score
      if (minScore === 1) {
        // Perfect score on all topics
        answerBody.strongTopics = topicScores.map(t => t.topic);
        answerBody.weakTopics = [];
      } else if (minScore === 0) {
        // Zero score on all topics
        answerBody.weakTopics = topicScores.map(t => t.topic);
        answerBody.strongTopics = [];
      } else if (topicScores.length === 1) {
        // Only one topic - can't be both strongest and weakest
        answerBody.strongTopics = topicScores.map(t => t.topic);
        answerBody.weakTopics = [];
      } else {
        // Equal but non-extreme performance
        // Use average answer time as secondary metric
        const topicTimes = new Map<string, {total: number, count: number}>();
        
        body.forEach((answer: any, index: number) => {
          const question = quizData[0].quiz.questions[index];
          const topic = question.sub_topic;
          
          if (!topicTimes.has(topic)) {
            topicTimes.set(topic, {total: 0, count: 0});
          }
          
          const data = topicTimes.get(topic)!;
          data.total += answer.timeTaken;
          data.count += 1;
        });
        
        const avgTimes = Array.from(topicTimes.entries()).map(([topic, data]) => {
          const avgTime = data.total / data.count;
          return { topic, avgTime };
        });
        
        if (avgTimes.length > 1) {
          // Sort by average time (faster = better)
          avgTimes.sort((a, b) => a.avgTime - b.avgTime);
          
          // Use fastest time as strength and slowest as weakness
          answerBody.strongTopics = [avgTimes[0].topic];
          answerBody.weakTopics = [avgTimes[avgTimes.length - 1].topic];
        } else {
          // Fallback if time data is insufficient
          answerBody.strongTopics = topicScores.map(t => t.topic);
          answerBody.weakTopics = [];
        }
      }
    } else {
      // Normal case (different scores)
      answerBody.weakTopics = weakTopics;
      answerBody.strongTopics = strongTopics;
    }

    await db.update(quizzes).set({
      submitted: true,
      answer: JSON.stringify(answerBody)
    }).where(
      and(
        eq(quizzes.userId, user.id), 
        eq(quizzes.id, id)
      )
    ).execute()

    const responseBody = {
      ...quizData[0],
      answer: answerBody,
      submitted: true
    }

    // Invalidate caches related to this quiz using Cloudflare's cache API
    const quizCacheKey = createCacheKey('quiz', user.id, id);
    const quizCacheUrl = new Request(`${c.env.BASE_URL}/cache/${quizCacheKey}`);
    
    c.executionCtx.waitUntil(Promise.all([
      caches.default.delete(quizCacheUrl),
    ]));

    return c.json({
      success: true, 
      message: "Quiz updated successfully.",
      quiz: responseBody
    }, 200);
    
  } catch (error: any) {
    console.error("Update quiz error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to update quiz. Please try again later." 
    }, 500);
  }
});

user.get('/getCheckoutLink', async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')

    if (!user || !user.id) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in." 
      }, 401);
    }

    const userData = await db.select().from(users).where(
      and(
        eq(users.id, user.id), 
        eq(users.email, user.email)
      )
    );

    if (!userData || !userData.length) {
      return c.json({
        success: false, 
        message: "User profile not found."
      }, 404);
    }


    const headersObj = headers(c.env.LEMON_SQUEEZY_API_KEY)
    const checkoutsData = await axios.post(`${c.env.LEMON_SQUEEZY_API_URL}/checkouts`, {
      data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: userData[0].email,
          custom: {
            userId: userData[0].id
          }
        }
      }, 
      relationships: {
        store: {
          data: {
            type: "stores",
            id: c.env.STORE_ID
          }
        },
        variant: {
          data: {
            type: "variants",
            id: c.env.PRO_VARIANT_ID
          }
        }
      }
    }
    }, {
      headers: headersObj
    })

    if (!checkoutsData || !checkoutsData.data) {
      return c.json({
        success: false, 
        message: "Failed to fetch checkouts. Please try again later."
      }, 404);
    }
    
    const response = {
      success: true, 
      checkoutLink: checkoutsData.data?.data?.attributes?.url,
      message: "Checkouts fetched successfully."
    };

    return c.json(response, 200);

  }
  catch (error: any) {
    console.error("Fetch checkouts error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to fetch checkouts. Please try again later." 
    }, 500);
  }
});

user.get('/customerPortal', async (c) => {
  try {
    const db = c.get('db')
    const user = c.get('user')

    if (!user || !user.id) {
      return c.json({
        success: false, 
        message: "Authentication required. Please log in." 
      }, 401);
    }

    const userData = await db.select().from(users).where(
      and(
        eq(users.id, user.id), 
        eq(users.email, user.email)
      )
    );

    if (!userData || !userData.length) {
      return c.json({
        success: false, 
        message: "User profile not found."
      }, 404);
    }


    const headersObj = headers(c.env.LEMON_SQUEEZY_API_KEY)
    const customerId = userData[0].customerId
    if (!customerId) {
      return c.json({
        success: false, 
        message: "No billing information found."
      }, 404);
    }
    const customerData = await axios.get(`${c.env.LEMON_SQUEEZY_API_URL}/customers/${customerId}`, {
      headers: headersObj
    })

    if (!customerData || !customerData.data) {
      return c.json({
        success: false, 
        message: "Failed to fetch billing page. Please try again later."
      }, 404);
    }

    const customerPortalLink = customerData.data?.data?.attributes?.urls?.customer_portal
    
    const response = {
      success: true, 
      customerPortal: customerPortalLink,
      message: "Billing page fetched successfully."
    };

    return c.json(response, 200);
  } catch (error: any) {
    console.error("Fetch billing link error:", error);
    return c.json({ 
      success: false, 
      message: "Failed to fetch billing page. Please try again later." 
    }, 500);
  }
});

export default user;