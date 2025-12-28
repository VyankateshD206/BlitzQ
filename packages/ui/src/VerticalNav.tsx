'use client'

import { Crown, X } from "lucide-react";
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import Profile from "./Profile";
import { profileState, quizListState } from "./store/atom";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation"
import { useAtom } from "jotai";
import { ProfileSkeleton } from "./Skeleton";
import Loading from "./Loading";
import InfiniteScroll from "react-infinite-scroll-component";

function VerticalNav({ setShowSideBar }: { setShowSideBar: Dispatch<SetStateAction<boolean>> }) {
  const [profile, setProfile] = useAtom(profileState)
  const [quizzes, setQuizzes] = useAtom(quizListState)
  const router = useRouter()
  const [quizLoading, setQuizLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const id = params.id || null

  const fetchUserData = async () => {
    try {
      setProfileLoading(true)
      const session = await getSession();
      if (!session || !session.user) {
        throw new Error('Unauthorized access')
      }

      const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${session.user}`
        }
      })

      if (resp && resp.data && resp.data.success) {
        setProfile(resp.data.user)
      } else if (resp && resp.data && !resp.data.success) {
        throw new Error(resp.data.message)
      } else {
        throw new Error('Failed to fetch the profile')
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data?.message || error.response.data?.error || `Failed to fetch the profile`)
        } else {
          toast.error("Failed to fetch the profile")
        }
      } else {
        toast.error(error.message || "Some error occured")
      }
      await signOut({ redirect: false })
      router.push('/')

    } finally {
      setProfileLoading(false)
    }
  }

  const fetchQuizzes = async (limit: number, offset: number) => {
    try {
      const session = await getSession();
      if (!session || !session.user) {
        throw new Error('Unauthorized access')
      }

      const resp = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/quizzes?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${session.user}`
        }
      })

      if (resp && resp.data && resp.data.success) {
        if (resp.data.quizzes.length < limit) {
          setHasMore(false)
        }
        setQuizzes(prev => {
          const existingIds = new Set(prev.map(quiz => quiz.id));
          const uniqueNewQuizzes = resp.data.quizzes.filter((quiz:any) => !existingIds.has(quiz.id));
          return [...prev, ...uniqueNewQuizzes];
        });
      } else if (resp && resp.data && !resp.data.success) {
        throw new Error(resp.data.message)
      } else {
        throw new Error('Failed to fetch the quizzes')
      }

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data?.message || error.response.data?.error || `Failed to fetch the quizzes`)
        } else {
          toast.error("Failed to fetch the quizzes")
        }
      } else {
        toast.error(error.message || "Some error occured")
      }

      setHasMore(false)
    } finally {
      setQuizLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const subParams = url.searchParams.get('sub');
    
    if (subParams === 'success') {
      toast.success('Subscription successful! Please wait a moment and refresh to see updates.');
    }
    
    setQuizzes([]);
    fetchUserData();
    fetchQuizzes(30, 0);
  }
  }, [])

  return (
    <div className="p-3 rounded-tr-lg rounded-br-lg h-screen bg-gray-100 w-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="text-purple-600 font-bold text-3xl text-center">
          BlitzQ
        </div>
        <div className="cursor-pointer w-max" onClick={() => setShowSideBar(false)}>
          <X />
        </div>
      </div>
      <div className="w-full bg-purple-600 text-white p-2 rounded-lg my-2 text-center">
        <Link href="/quiz" className="w-full">
          New Quiz
        </Link>
      </div>

      <div className="flex-grow overflow-hidden">
        {(!quizLoading) ?<div 
          id="scrollableDiv"
          ref={scrollableRef}
          className="h-full overflow-y-auto"
        >
          <InfiniteScroll
            dataLength={quizzes.length}
            next={() => fetchQuizzes(30, quizzes.length)}
            scrollThreshold={1}
            hasMore={hasMore}
            loader={<div className="w-full flex justify-center items-center p-4"><Loading color="purple-600"/></div>}
            scrollableTarget="scrollableDiv"
          >
            {quizzes.map((quiz, index) => (
              <div className={`rounded-lg p-2 mt-1 cursor-pointer hover:bg-gray-200 w-full ${quiz.id === id ? 'bg-gray-200' : ''}`} key={quiz.id}>
                <Link href={`/quiz/${quiz.id}`} className="w-full flex justify-between items-center">
                  <div className="truncate">{quiz.title}</div>
                </Link>
              </div>
            ))}
          </InfiniteScroll>
        </div>
        :
        <div className="h-full">
            <div className="w-full h-full flex justify-center items-center"> <Loading color="purple-600"/> </div>
        </div>  
      }
        
      </div>

      {(profileLoading) ? <ProfileSkeleton /> : (profile) ? <Popover>
        <PopoverTrigger>
          <div className="flex items-center gap-2 mt-3 bg-white p-2 rounded-lg cursor-pointer">
            <div className="w-[40px] h-[40px] bg-gradient-to-r from-purple-600 to-pink-900 flex justify-center items-center rounded-full">
              {(profile.profileImg) ? <img src={profile.profileImg} alt="User Image" className="w-[40px] h-[40px] rounded-full min-w-[40px] min-h-[40px] rounded-full object-cover bg-white" onError={(e) => e.currentTarget.src = '/usericon.png'}/> :
                <div className="text-white text-xl">{profile.email[0]?.toLocaleUpperCase()}</div>
              }
            </div>
            <div className="flex-grow overflow-hidden text-left ">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">{profile.email}</div>
              <div className="text-gray-600">
                <div className={`flex gap-1 items-center rounded-full px-1 text-md font-medium w-max ${profile.tier === 'pro' ? 'text-purple-600' : 'text-gray-600'}`}>
                  <div className={`${profile.tier === 'pro' ? 'text-purple-600' : 'text-gray-600'}`}>
                    <Crown
                      size={16}
                    />
                  </div>
                  <div>{profile.tier[0]?.toUpperCase() + profile.tier.slice(1)}</div>
                </div>
              </div>
              <div className="text-gray-600 font-medium">Quiz left - {profile.quota}</div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          <Profile profile={profile} />
        </PopoverContent>
      </Popover> : <></>}
    </div>
  )
}

export default VerticalNav;