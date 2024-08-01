import axios from 'axios';

const API_KEY = 'AIzaSyBls8XZnNom_ZU7rFN46dqKNBua-6rU3O8';

const getVideoDetails = async (videoIds: string[]): Promise<any[]> => {
    const ids = videoIds.join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=contentDetails&key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data.items;
};

const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (match) {
        hours = parseInt(match[1]) || 0;
        minutes = parseInt(match[2]) || 0;
        seconds = parseInt(match[3]) || 0;
    }
    return hours * 3600 + minutes * 60 + seconds;
};

const getTotalVideoLength = async (videoUrls: string[] | undefined): Promise<number> => {
    if (videoUrls && videoUrls.length > 0) {
        const videoIds = videoUrls.map(url => {
            if (url.includes('v=')) {
                return url.split('v=')[1];
            } else {
                const urlObj = new URL(url);
                return urlObj.pathname.slice(1);
            }
        });

        const videoDetails = await getVideoDetails(videoIds);
        const totalLength = videoDetails.reduce((sum, video) => {
            const duration = video.contentDetails.duration;
            return sum + parseDuration(duration);
        }, 0);

        return totalLength;
    } else {
        return 0;
    }

};

export default getTotalVideoLength;