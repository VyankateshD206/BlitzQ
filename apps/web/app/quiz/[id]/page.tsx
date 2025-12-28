import Quiz from "@repo/ui/Quiz";

async function QuizPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  return <div>
    <div>
        <Quiz
          quizId={id}
        />
    </div>
  </div>;
}


export default QuizPage;