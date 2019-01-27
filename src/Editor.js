import React from "react";
import ReactQuill from "react-quill";
import config from "./config";
import "react-quill/dist/quill.snow.css";

class Editor extends React.Component {
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
      let maxId = -1;
      for (var i = 0; i < this.state.blogs.length; i++) {
        if (this.state.blogs[i].id > maxId) {
          maxId = this.state.blogs[i].id;
        }
      }
      // let maxId = this.state.blogs.reduce((prev, current) =>
      //   prev.id > current.id ? prev.id : current.id;
      // );
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

  handleTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  handleBodyChange(value) {
    this.setState({ body: value });
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

  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      ["link", "image", "code-block"],
      ["clean"]
    ]
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];

  render() {
    return (
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
          <ReactQuill
            theme="snow"
            modules={this.modules}
            formats={this.formats}
            value={this.state.body}
            onChange={this.handleBodyChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Editor;
