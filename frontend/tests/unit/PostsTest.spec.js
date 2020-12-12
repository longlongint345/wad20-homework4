import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import moment from 'moment'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('Correct number of posts in rendered', function () {
        let nrOfPosts = testData.length;
        let nrOfRenderedPosts = wrapper.findAll('div.post').length;
        expect(nrOfRenderedPosts).toEqual(nrOfPosts);

    });

    it('Correct tags are rendered for media type image', function (){
        let posts = wrapper.findAll('div.post');

        let imagePost = posts.at(0); // post with image media
        // post-image tag exists
        expect(imagePost.find('div.post-image').exists()).toBe(true)

        // the tag contains an image tag and does not contain a video tag
        let postVisualContent = imagePost.find('div.post-image');
        expect(postVisualContent.find('img').exists()).toBe(true)
        expect(postVisualContent.find('video').exists()).toBe(false)
    });

    it('Correct tags are rendered for media type null', function (){
        let posts = wrapper.findAll('div.post');
        let nullMediaPost = posts.at(1);
        // post-image tag does not exist
        expect(nullMediaPost.find('div.post-image').exists()).toBe(false);
    });

    it('Correct tags are rendered for media type video', function (){
        let posts = wrapper.findAll('div.post');
        let videoPost = posts.at(2);
        // post-image tag exists
        expect(videoPost.find('div.post-image').exists()).toBe(true);

        // the tag contains a video tag and does not contain an image tag
        let postVisualContent = videoPost.find('div.post-image');
        expect(postVisualContent.find('video').exists()).toBe(true);
        expect(postVisualContent.find('img').exists()).toBe(false);
    })

    it('Post create time is displayed in correct format', function (){
        let posts = wrapper.findAll('div.post');
        for (let i = 0; i < posts.length; i++){
            let timeTag = posts.at(i).find('span.post-author > small');
            expect(timeTag.text()).toEqual(moment(testData[i].createTime).format('LLLL'));
        }
    });
});