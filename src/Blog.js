import React from "react";

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    retrievedData: false,
    blogs: [],
    title: "",
    body: "",
    objectToUpdate: {}
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

  deleteBlogFromDb = () => {};

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
        { title: this.state.title, body: this.state.body },
        ...this.state.blogs
      ]
    });
    this.setState({ title: "" });
    this.setState({ body: "" });
  }

  removeBlogPost = blogTitle => {
    console.log(blogTitle);
    this.setState({
      blogs: this.state.blogs.filter(e => {
        return e.title !== blogTitle;
      })
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
              <div>Title: {blog.title}</div>
              <div> {blog.body}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Blog;
