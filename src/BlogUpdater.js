import React from 'react';
import config from './config';

class BlogUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {
      retrievedData: false,
      blogs: [],
      currentId: -1,
      title: "",
      body: "",
      updateTitle: "",
      updateBody: ""
    };
  }

  componentDidMount() {
    this.getBlogsFromDb();
  }

  getBlogsFromDb = () => {
    fetch(config.API_GET_ENDPOINT, { mode: "cors" })
      .then(data => data.json())
      .then(res => {
        this.setState({ blogs: this.parseBlogs(res.data) });
        this.updateCurrentId();
        console.log(this.parseBlogs(res.data));
      });
  };

  updateCurrentId = () => {
    if (this.state.blogs.length) {
      let maxId = -1;
      for (var i = 0; i < this.state.blogs.length; i++) {
        if (this.state.blogs[i].id > maxId) {
          maxId = this.state.blogs[i].id;
        }
      }
      this.setState({ currentId: maxId });
      console.log("Max Id " + maxId);
    }
  };

  parseBlogs = data => {
    return data
      .map(blog => {
        return {
          id: blog.id,
          title: blog.title,
          body: blog.body,
          createdAt: new Date(blog.createdAt).toUTCString(),
          editMode: false
        };
      })
      .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  };

  addBlogToDb = () => {
    this.postHelper(
      config.API_CREATE_ENDPOINT,
      this.state.currentId + 1,
      this.state.title,
      this.state.body
    );
  };

  updateBlogToDb = (id, title, body) => {
    this.postHelper(config.API_UPDATE_ENDPOINT, id, title, body);
  };

  postHelper = (endpoint, id, title, body) => {
    let updateBlogData = {
      id: id,
      title: title,
      body: body
    };
    let fetchParams = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateBlogData)
    };

    fetch(endpoint, fetchParams)
      .then(promise => console.log(promise))
      .then(res => console.log(res));
  };

  deleteBlogFromDb = id => {
    let fetchParams = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id })
    };
    fetch(config.API_DELETE_ENDPOINT, fetchParams)
      .then(data => console.log(data.json()))
      .then(res => console.log(res));
  };

  handleTitleUpdate(e) {
    this.setState({ updateTitle: e.target.value });
  }

  handleBodyUpdate(e) {
    this.setState({ updateBody: e.target.value });
  }

  handleUpdate(index, title, body) {
    let updatedBlogs = this.state.blogs;
    let newTitle = this.state.updateTitle === "" ? title : this.state.updateTitle;
    let newBody = this.state.updateBody === "" ? body : this.state.updateBody;
    updatedBlogs[index].title = newTitle;
    updatedBlogs[index].body = newBody;
    updatedBlogs[index].editMode = !updatedBlogs[index].editMode;
    this.setState({ blogs: updatedBlogs, updateTitle: "", updateBody: "" });
    this.updateBlogToDb(updatedBlogs[index].id, newTitle, newBody);
  }

  removeBlogPost = id => {
    console.log(id);
    this.setState({
      blogs: this.state.blogs.filter(blog => {
        return blog.id !== id;
      })
    });
    this.deleteBlogFromDb(id);
  };

  enableEditModeForBlog = index => {
    let updatedBlogs = this.state.blogs;
    updatedBlogs[index].editMode = !updatedBlogs[index].editMode;
    this.setState({ blogs: updatedBlogs });
  };

  render() {
    return (
      <div className="parent">
        <div className="posts-panel grid">
          <header className="panel-header">
            <h1 className="panel-title"> Featured Blogs </h1>
          </header>
          <div className="panel-content">
            <section className="pinned-post">
              <div className="post-item">
                <a href="#" className="post-thumbnail">
                  <img
                    src="https://static.pexels.com/photos/66274/sunset-poppy-backlight-66274.jpeg"
                    alt=""
                  />
                </a>
                <div className="post-text">
                  <a href="#">
                    <h3 className="post-title">Post title place-holder</h3>
                  </a>
                  <div className="post-meta">
                    <span className="meta">
                      <span
                        className="meta-icon fa fa-user-circle-o"
                        aria-hidden="true"
                      />
                      <a className="meta-text">Steve Jobs</a>
                    </span>
                    <span className="meta">
                      <span
                        className="meta-icon fa fa-clock-o"
                        aria-hidden="true"
                      />
                      <span className="meta-text">22/06/2030</span>
                    </span>
                  </div>

                  <div className="post-summary">
                    <p>
                      Your work is going to fill a large part of your life, and
                      the only way to be truly satisfied is to do what you
                      believe is great work. And the only way to do great work
                      is to love what you do. If you haven't found it yet, keep
                      looking. Don't settle. As with all matters of the heart,
                      you'll know when you find it....
                          <a href="#" className="post-read-more">
                        Read more
                            <span
                          className="fa fa-chevron-circle-right"
                          aria-hidden="true"
                        />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="posts-list">
              {this.state.blogs.map((blog, index) => (
                <div className="post-item" key={index}>
                  <a href="#" className="post-thumbnail">
                    <img
                      src="https://static.pexels.com/photos/66274/sunset-poppy-backlight-66274.jpeg"
                      alt=""
                    />
                  </a>
                  <div className="post-text">
                    <a href="#">
                      <h3 className="post-title">{blog.title}</h3>
                    </a>
                    <div className="post-meta">
                      <span className="meta">
                        <span
                          className="meta-icon fa fa-user-circle-o"
                          aria-hidden="true"
                        />
                        <a className="meta-text">Clarence Nguyen</a>
                      </span>
                      <span className="meta">
                        <span
                          className="meta-icon fa fa-clock-o"
                          aria-hidden="true"
                        />
                        <span className="meta-text">{blog.createdAt}</span>
                      </span>
                    </div>
                    <div className="post-summary">
                      <p>
                        {blog.body}
                        <a href="#" className="post-read-more">
                          Read more
                              <span
                            className="fa fa-chevron-circle-right"
                            aria-hidden="true"
                          />
                        </a>
                      </p>
                      <button onClick={() => this.removeBlogPost(blog.id)}>
                        Delete
                          </button>
                      <button onClick={() => this.enableEditModeForBlog(index)}>
                        Edit Mode
                          </button>
                      {blog.editMode && (
                        <div>
                          <label>Title: {blog.title}</label>
                          <input
                            type="text"
                            value={this.state.updateTitle}
                            onChange={this.handleTitleUpdate}
                          />
                          <label>Body: {blog.body} </label>
                          <textarea
                            type="text"
                            value={this.state.updateBody}
                            onChange={this.handleBodyUpdate}
                          />
                          <input
                            type="button"
                            value="Save"
                            onClick={() =>
                              this.handleUpdate(index, blog.title, blog.body)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default BlogUpdater;
