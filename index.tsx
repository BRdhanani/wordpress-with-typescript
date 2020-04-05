import React, { useState, Fragment, useEffect } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import axios from 'axios';
import { Card, Col, Row, Avatar } from 'antd';
const { Meta } = Card;
import './styles.css';

/**
 * Interface for post title, content and excerpt
 */
interface ContentObject {
	//This property is always present
	rendered: string;
	//This property is only present in some contexts
	raw?: string;
}

/**
 * Interface for describing post title
 */
interface PostTitle extends ContentObject {}
/**
 * Interface for describing post content
 */
interface PostContent extends ContentObject {}
/**
 * Interface for describing post content
 */
interface PostExcerpt extends ContentObject {}

/**
 * Interface descrinbing a WordPress post
 */
interface Post {
	title: PostTitle;
	content: PostContent;
	excerpt: PostExcerpt;
	date: string;
	id: number;
}

/**
 * Display A Blog Post
 *
 * @param props
 */
const BlogPost = (props: { post: Post; showContent: boolean }) => {
	const { post, showContent } = props;

	function createMarkup(markup: string) {
		return { __html: markup };
	}
	return (
		<Col
			span={6}
			style={{
				paddingTop: 50,
				paddingBottom: 0,
				paddingRight: 0,
				paddingLeft: 50
			}}
			id={`post-${post.id}`}>
			<h1>{post.title.rendered}</h1>
			<div>
				{showContent ? (
					<div dangerouslySetInnerHTML={createMarkup(post.content.rendered)} />
				) : (
					<div dangerouslySetInnerHTML={createMarkup(post.excerpt.rendered)} />
				)}
			</div>
		</Col>
	);
};

/**
 * Control for remote API URL
 * @param props
 */
const ApiUrl = (props: {
	url: string;
	changeHandler: (newValue: string) => void;
}) => {
	const { url, changeHandler } = props;
	return (
		<div>
			<label htmlFor={'remote-api'}>Remote API URL</label>
			<input
				id={'remote-api'}
				type={'url'}
				value={url}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					e.preventDefault();
					changeHandler(e.target.value);
				}}
			/>
		</div>
	);
};
/**
 * Display a list of posts
 *
 * @param props
 */
const ListOfPosts = (props: {
	posts: Array<Post>;
	showContent: boolean;
	toggleShowContent: (enable: boolean) => void;
}) => {
	const { posts, showContent, toggleShowContent } = props;
	return (
		<div className="site-card-wrapper">
			<Row gutter={16}>
				<button
					onClick={(e: React.FormEvent<HTMLInputElement>) => {
						e.preventDefault();
						toggleShowContent(!showContent);
					}}>
					Show Full Content
				</button>
				<Fragment>
					{posts.length > 0 &&
						posts.map((post: Post) => (
							<BlogPost key={post.id} post={post} showContent={showContent} />
						))}
				</Fragment>
			</Row>
		</div>
	);
};
const post: Post = {
	id: 42,
	title: {
		rendered: 'Post Title'
	},
	content: {
		rendered: 'Post Content'
	},
	excerpt: {
		rendered: 'Post Excerpt'
	},
	date: '2019-03-19T06:53:51'
};

function App() {
	/**
	 * State of content vs excerpt display
	 * Putting it here to demonstrate passing change handlers
	 */
	const [showContent, toggleShowContent] = useState<boolean | null>(null);

	/**
	 * Put posts in state
	 */
	const [posts, setPosts] = useState<Array<Post>>([post]);

	/**
	 * Get posts via remote API
	 */
	const url = 'https://wholeblogs.com/wp-json/wp/v2/posts';
	useEffect(() => {
		async function anyNameFunction() {
			await axios(url)
				.then(r => {
					setPosts(r.data);
				})
				.catch(error => {
					console.log(error.response);
				});
		}
		anyNameFunction();
	}, [url]);

	return (
		<div className="App">
			<ListOfPosts
				posts={posts}
				showContent={showContent}
				toggleShowContent={toggleShowContent}
			/>
		</div>
	);
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);
