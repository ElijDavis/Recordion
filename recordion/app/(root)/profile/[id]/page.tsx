import Header from "@/components/Header";
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants';

//{params}:ParamsWithSearch
//the line above was inside the empty parenthesis after async
const Page = async () => {
    //const {id} = await params;
    return (
        <div className="wrapper page">
            <Header subHeader='elijahadavis@hotmail.com' title='Elijah Davis' userImg="/assets/images/dummy.jpg"/>
                <section className="video-grid">
                    {dummyCards.map((card) => (
                        <VideoCard key={card.id} {...card} />
                    ))}
                </section>
        </div>
    )
}

export default Page