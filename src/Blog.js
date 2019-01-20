import React from "react";

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.enableEditModeForBlog = this.enableEditModeForBlog.bind(this);
  }

  state = {
    retrievedData: false,
    blogs: [],
    currentId: 0,
    title: "",
    body: "",
    objectToUpdate: {},
    updateView: false,
    updateTitle: "",
    updateBody: ""
  };

  componentDidMount() {
    // this.getBlogsFromDb();
  }

  getBlogsFromDb = () => {
    fetch("/blogs/api/get")
      .then(data => data.json())
      .then(res => this.setState({ blogs: res.data }));
  };

  addBlogToDb = () => {
    let newBlogData = {
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
    fetch("/blogs/api/post", fetchParams).then(response => response.json());
  };

  deleteBlogFromDb = () => { };

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleBodyChange(e) {
    this.setState({ body: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      blogs: [
        {
          id: this.state.currentId,
          title: this.state.title,
          body: this.state.body,
          editMode: false
        },
        ...this.state.blogs
      ],
      currentId: this.state.currentId + 1
    });
    this.setState({ title: "", body: "" });
  }

  removeBlogPost = blogTitle => {
    console.log(blogTitle);
    this.setState({
      blogs: this.state.blogs.filter(e => {
        return e.title !== blogTitle;
      })
    });
  };

  enableEditModeForBlog(index) {
    let updatedBlogs = this.state.blogs;
    updatedBlogs[index].editMode = !updatedBlogs[index].editMode;
    this.setState({
      blogs: updatedBlogs
    });
  }

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
    updatedBlogs[index] = {
      title: newTitle,
      body: newBody
    };

    this.setState({
      blogs: updatedBlogs
    });
    this.setState({ updateTitle: "", updateBody: "" });
  }

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
