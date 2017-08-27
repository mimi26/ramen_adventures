import React, { Component } from 'react';
import BestOfNav from './BestOfNav';
import moment from 'moment';

class SearchResults extends Component {
    constructor() {
        super();
        this.renderPosts = this.renderPosts.bind(this);
        this.renderShops = this.renderShops.bind(this);
    }
    componentWillUnmount() {
       this.props.resetIsSearching();
    }

    renderPosts (key) {
        const { searchResultsPosts } = this.props;
            return (
                <li key={key}>
                    <div className="results-post">
                        <p> 
                            <span className="results-date">
                                Posted on: {moment(searchResultsPosts[key].date).format('MMMM Do YYYY')} -
                            </span>
                            {searchResultsPosts[key].content.slice(0, 300)}...(Click for more)
                        </p>
                    </div>
                </li>
            )
    }

    renderShops(key) {
        const { searchResultsShops } = this.props;
        return (
            <li key={key}>
                <div className="results-post">
                    <p>{searchResultsShops[key].name}</p>
                </div>
            </li>
        )
    }

    render() {
        const { query, searchResultsPosts, searchResultsShops } = this.props;
        const totalResults = searchResultsPosts.length + searchResultsShops.length;
       
        return (
            <div className="search-results-container">
                <BestOfNav />
                <div className="results-container">
                <h1>There are {totalResults} results for "{query}"</h1>
                <ul className="results-posts">
                    {Object.keys(searchResultsPosts).map((key) => {
                            return this.renderPosts(key);
                        })}
                </ul>
                <ul className="results-posts">
                    {Object.keys(searchResultsShops).map((key) => {
                        return this.renderShops(key);
                    })}
                </ul>
                </div>
            </div>
        );
    }
}

export default SearchResults;