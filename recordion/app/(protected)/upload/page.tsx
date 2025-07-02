'use client'

import FormField from "@/components/FormField"
import FileInput from "@/components/FileInput"
import { useEffect, useState } from "react"
import { ChangeEvent } from "react"
import { useFileInput } from "@/lib/hooks/useFileInput"
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants"
import { FormEvent } from "react"
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video"
import { useRouter } from "next/navigation"

type Visibility = "public" | "private";

const uploadFileToBunny = (file: File, uploadUrl: string, accessKey: string): Promise<void> => {
    return fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            'AccessKey': accessKey
        },
        body: file,
    }).then((response) => {
        if (!response.ok) {
            throw new Error('Failed to upload file to Bunny');
        }
    })
}

const Page = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [videoDuration, setVideoDuration] = useState(0)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        visibility: "public"
    })

    const video = useFileInput(MAX_VIDEO_SIZE)
    const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE)

    useEffect(() => {
        if(video.duration !== null || 0){
            setVideoDuration(video.duration)
        }
    }, [video.duration])

    useEffect(() => {
        const checkForRecordedVideo = async () => {
            try{
                const stored = sessionStorage.getItem('recordedVideo');

                if(!stored) return

                const { url, name, type, duration } = JSON.parse(stored);
                const blob = await fetch(url).then((res) => res.blob());
                const file = new File([blob], name, { type, lastModified: Date.now() });

                if(video.inputRef.current){
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    video.inputRef.current.files = dataTransfer.files;
                    const event = new Event('change', { bubbles: true });
                    video.inputRef.current.dispatchEvent(event);

                    video.handleFileChange({
                        target: {files: dataTransfer.files}
                    } as ChangeEvent<HTMLInputElement>)
                }

                if(duration) setVideoDuration(duration);

                sessionStorage.removeItem('recordedVideo');
                URL.revokeObjectURL(url)

            } catch (e){
                console.error(e, 'Error loading recorded video');
            }
        }
        checkForRecordedVideo();
    }, [video])

    const [error, setError] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true)

        try{
            if(!video.file || !thumbnail.file){
                setError('Please upload video and thumbnail');
                return;
            }
            if(!formData.title || !formData.description){
                setError('Please fill in all the details');
                return;
            }
            //upload video to Bunny
            const {
                videoId, 
                uploadUrl: videoUploadUrl, 
                AccessKey: videoAccessKey
            } = await getVideoUploadUrl();

            if(!videoUploadUrl || !videoAccessKey){
                throw new Error('Failed to get video upload credentials');
            }

            await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey)
            //upload thumbnail to db

            const {
                uploadUrl: thumbnailUploadUrl, 
                accessKey: thumbnailAccessKey,
                cdnUrl: thumbnailCdnUrl
            } = await getThumbnailUploadUrl(videoId);

            if(!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey){
                throw new Error('Failed to get thumbnail upload credentials');
            }
            //attach thumbnail
            await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey)
            //create new db entry for the video details (urls, data)
            await saveVideoDetails({
                videoId,
                thumbnailUrl: thumbnailCdnUrl,
                ...formData,
                visibility: formData.visibility as Visibility,
                duration: videoDuration
            })

            router.push(`/`)

        } catch (error){
            console.log('Error submitting form: ', error)
        } finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className="wrapper-md upload-page">
            <h1>Upload a video</h1>

            {error && <div className="error-field">{error}</div>}

            <form className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5" onSubmit={handleSubmit}>
                <FormField 
                    id="title"
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear and concise video title"
                />
                <FormField 
                    id="description"
                    as="textarea"
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this video is about"
                />
                <FileInput
                id="video"
                label="video"
                accept="video/*" 
                file={video.file}
                previewUrl={video.previewUrl}
                inputRef={video.inputRef}
                onChange={video.handleFileChange}
                onReset={video.resetFile}
                type="video"
                />
                <FileInput
                id="thumbnail"
                label="thumbnail"
                accept="image/*" 
                file={thumbnail.file}
                previewUrl={thumbnail.previewUrl}
                inputRef={thumbnail.inputRef}
                onChange={thumbnail.handleFileChange}
                onReset={thumbnail.resetFile}
                type="image"
                />
                <FormField 
                    id="visibility"
                    as="select"
                    label="Visibility"
                    options={[
                        {value: 'public', label: 'Public'},
                        {value: 'private', label: 'Private'}
                    ]}
                    value={formData.visibility}
                    onChange={handleInputChange}
                />
                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Uploading...' : 'Upload video'}
                </button>
            </form>
        </div>
    )
}
export default Page