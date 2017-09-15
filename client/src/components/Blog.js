import React, { Component } from 'react';
import BestOfNav from './BestOfNav';
import BlogPhotos from './BlogPhotos';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Blog extends Component {

    render() {
        return (
            <div className="blog-container">
                <BestOfNav />
                <div className="posts-container">
                    <h2>Recent Posts</h2>
                    <div className="post-container">
                        <Link to="/blogpost">
                        <BlogPhotos firstPost={this.props.firstPost}
                                    secondPost={this.props.secondPost}
                                    thirdPost={this.props.thirdPost} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Blog;