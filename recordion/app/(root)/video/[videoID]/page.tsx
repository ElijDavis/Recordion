import VideoDetailHeader from '@/components/VideoDetailHeader';
import VideoPlayer from '@/components/VideoPlayer';
import { getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}: Params) => {
    const { videoID } = await params; // Should match your dynamic route [videoID]
    const {user, video} = await getVideoById(videoID);
    if(!video) redirect('/404');

    return (
        <main className="wrapper page">
            <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId}/>
            <h1 className="text-2xl">{video.title}</h1>
            <section className="video-details">
                <div className="content">
                    <VideoPlayer videoId={video.videoId}/>
                </div>
            </section>
        </main>
    )
}

export default Page