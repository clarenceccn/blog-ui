import React from "react";
import config from "./config";

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  state = {
    retrievedData: false,
    blogs: [],
    currentId: -1,
    title: "",
    body: "",
    updateTitle: "",
    updateBody: ""
  };

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
      let maxId = this.state.blogs.reduce((prev, current) =>
        prev.id > current.id ? prev.id : current.id
      );
      this.setState({ currentId: maxId });
      console.log(maxId);
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
    let newBlogData = {
      id: this.state.currentId + 1,
      title: this.state.title,
      body: this.state.body
    };
    let fetchParams = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newBlogData)
    };

    fetch(config.API_CREATE_ENDPOINT, fetchParams)
      .then(promise => promise.json())
      .then(res => console.log(res));
  };

  updateBlogToDb = () => {};

  deleteBlogFromDb = () => {};

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleBodyChange(e) {
    this.setState({ body: e.target.value });
  }

  handleTitleUpdate(e) {
    this.setState({ updateTitle: e.target.value });
  }

  handleBodyUpdate(e) {
    this.setState({ updateBody: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.addBlogToDb();
    this.setState({
      blogs: [
        {
          id: this.state.currentId + 1,
          title: this.state.title,
          body: this.state.body,
          editMode: false
        },
        ...this.state.blogs
      ],
      currentId: this.state.currentId + 1,
      title: "",
      body: ""
    });
  }

  handleUpdate(index, title, body) {
    let updatedBlogs = this.state.blogs;
    let newTitle =
      this.state.updateTitle === "" ? title : this.state.updateTitle;
    let newBody = this.state.updateBody === "" ? body : this.state.updateBody;
    updatedBlogs[index] = {
      title: newTitle,
      body: newBody,
      editMode: !updatedBlogs[index].editMode
    };
    this.setState({ ublogs: updatedBlogs, pdateTitle: "", updateBody: "" });
  }

  removeBlogPost = blogTitle => {
    console.log(blogTitle);
    this.setState({
      blogs: this.state.blogs.filter(e => {
        return e.title !== blogTitle;
      })
    });
  };

  enableEditModeForBlog = index => {
    let updatedBlogs = this.state.blogs;
    updatedBlogs[index].editMode = !updatedBlogs[index].editMode;
    this.setState({
      blogs: updatedBlogs
    });
  };

  render() {
    return (
      <div>
        <div className="create-form">
          <form onSubmit={this.handleSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
            </label>
            <label>
              Body:
              <textarea
                name="body"
                value={this.state.body}
                onChange={this.handleBodyChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="listing">
          {this.state.blogs.map((blog, index) => (
            <div key={index}>
              <button onClick={() => this.removeBlogPost(blog.title)}>
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
              {!blog.editMode && (
                <div>
                  <div>Title: {blog.title}</div>
                  <div> {blog.body}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Blog;
