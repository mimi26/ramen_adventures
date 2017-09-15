import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Auth from './modules/Auth';
import RegisterForm from './components/RegisterForm';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import Store from './components/Store';
import Tours from './components/Tours';
import Schools from './components/Schools';
import Media from './components/Media';
import AboutMe from './components/AboutMe';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import SignIn from './components/SignIn';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      auth: Auth.isUserAuthenticated(),
      id: Auth.idUser(),
      email: '',
      redirectToRegister: false,
      isSearching: false,
      searchQuery: '',
      searchResultsPosts: [],
      searchResultsShops: []
    }

    this.registerSubmit = this.registerSubmit.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.logOut = this.logOut.bind(this);
    this.emailSubmit = this.emailSubmit.bind(this);
    this.resetRedirect = this.resetRedirect.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.search = this.search.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.resetIsSearching = this.resetIsSearching.bind(this);
  }

  registerSubmit(e) {
    e.preventDefault();
    axios.post('/users', {
      user: {
        first_name: e.target.firstName.value,
        last_name: e.target.lastName.value,
        email: e.target.email.value,
        password: e.target.password.value,
    }
    }).then(jsonRes => {
      if (jsonRes.token !== undefined) {
        Auth.authenticateUser(jsonRes.token);
      }
      this.setState({
        auth: Auth.isUserAuthenticated()
      });
    }).catch(err => console.log(err));
  }

  loginSubmit(e) {
    e.preventDefault();
  
    axios.post('/login', {
        email: e.target.email.value,
        password: e.target.password.value,
      }).then((jsonRes) => {
        console.log(jsonRes);
      if (jsonRes.token === undefined) {
        Auth.authenticateUser(jsonRes.token);
      }
      this.setState({
        auth: Auth.authenticateUser(jsonRes.data.token),
        id: Auth.idUser(jsonRes.data.id)
      });
    }).catch(err => console.log(err));
  }

  logOut() {
        axios.delete('/logout', {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Token token=${Auth.getToken()}`
            }
         })
          .then(jsonRes => {
        Auth.deauthenticateUser();
        this.setState({
            auth: Auth.deauthenticateUser(),
        });
      }).catch(err => console.log(err));
    }

    emailSubmit(e) {
      const email = e.target.email.value;
      e.preventDefault();
      this.setState({ email, redirectToRegister: true });
    }

    resetRedirect() {
      this.setState({ redirectToRegister: false });
    }
    
    getSearchResults(query) {
      axios.post(`/search`, { q: query })
      .then((res) => {    
          this.setState({ 
            searchResultsPosts: res.data.posts,
            searchResultsShops: res.data.shops,
            searchQuery: '',
            query: query
          });     
      });
    }

  search(e) {
    e.preventDefault();
    this.getSearchResults(this.state.searchQuery);
    this.setState({ isSearching: true })
  }

  handleSearchChange(event) {
      this.setState({ searchQuery: event.target.value })
  }

  resetIsSearching() {
    if (this.state.isSearching) { 
    this.setState({ isSearching: false });
    } 
  }

  render() {
    return (
        <BrowserRouter>
          <div className="App">
              <Navigation logOut={this.logOut}
                          resetRedirect={this.resetRedirect}
                          getSearchResults={this.getSearchResults}
                          search={this.search}
                          handleSearchChange={this.handleSearchChange}
                          searchQuery={this.state.searchQuery}
              />
              <div>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/register" component={(props) => <RegisterForm {...props} 
                                          registerSubmit={this.registerSubmit}
                                          email={this.state.email}/>} 
                  />
                  <Route path="/search" component={(props) => <SearchResults {...props}
                                        searchResultsPosts={this.state.searchResultsPosts}
                                        searchResultsShops={this.state.searchResultsShops}
                                        query={this.state.query}
                                        resetIsSearching={this.resetIsSearching} />}
                  />
                  <Route path="/store" component={Store} />
                  <Route path='/tours' component={Tours} />
                  <Route path='/schools' component={Schools} />
                  <Route path='/media' component={Media} />
                  <Route path='/about' component={AboutMe} />
                  <Route path="/blog" component={Blog} />
                  <Route path="/blogpost" component={BlogPost} />
                  <Route path="/signin" component={(props) => <SignIn {...props}
                                        loginSubmit={this.loginSubmit}
                                        emailSubmit={this.emailSubmit}
                                        redirectToRegister={this.state.redirectToRegister}
                                        resetRedirect={this.resetRedirect} />} 
                  />
                </Switch>
              </div>
              <Footer />
              {(this.state.isSearching) && <Redirect to="/search" />}
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
