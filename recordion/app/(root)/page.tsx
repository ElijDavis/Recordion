import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
//import { dummyCards } from '@/constants';
import { getAllVideos } from '@/lib/actions/video';

const Page = async ({searchParams}: SearchParams) => {
  const {query, filter, page} = await searchParams;

  const {videos, pagination } = await getAllVideos(query, filter, Number(page) || 1);

  return (
    <main className="wrapper page">
      <Header title="All Videos" subHeader="Public Library"/>
      {/*<h1 className="text-2xl font-karla">Welcome to Recordion</h1>*/}
          {videos?.length > 0 ?
          (
            <section className="video-grid">
              {videos.map(({video, user}) => (
                <VideoCard 
                key={video.id} 
                {...video} 
                thumbnail={video.thumbnailUrl}
                userImg={user?.image || ''} 
                username={user?.name || 'Guest'}/>
              ))}
            </section>
          ) : (
            <div>
              <EmptyState icon="/assets/icons/vido.svg" title="No Videos Found" description='Try adjusting your search'/>
            </div>
          )}
    </main>
  );
}

export default Page