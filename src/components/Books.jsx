import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import "./index.css";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";

const styles = (theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    height: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "25%",
    left: "40%",
    outline: "none",
  },

  root: {
    display: "flex",
    flexWrap: "wrap",
  },

  margin: {
    margin: theme.spacing(1),
  },

  textField: {
    width: "25ch",
  },

  cancelButton: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  addButton: {
    marginTop: "30px",
    marginBottom: "30px",
    left: "50%",
  },
});

class Books extends Component {
  state = {
    books: [],
    newBookData: {
      id: "",
      title: "",
      author: "",
      rating: "",
      genre: "",
      read: "",
      description: "",
    },
    editBookData: {
      title: "",
      author: "",
      rating: "",
      genre: "",
      read: "",
      description: "",
    },
    newBookModal: false,
    editBookModal: false,
  };

  UNSAFE_componentWillMount() {
    axios.get("http://localhost:3000/books", { headers: { "Content-Type": "application/json" } }).then((response) => {
      this.setState({
        books: response.data,
      });
    });
  }
  toggleNewBook() {
    this.setState({
      newBookModal: !this.state.newBookModal,
    });
  }

  handleClose() {
    this.setState({
      newBookModal: !this.state.newBookModal,
    });
  }

  addBook() {
    axios
      .post("http://localhost:3000/books", this.state.newBookData, { headers: { "Content-Type": "application/json" } },)
      .then((response) => {
        let { books } = this.state;
        books.push(response.data);
        this.setState({
          books,
          newBookModal: false,
          newBookData: {
            id: "",
            title: "",
            author: "",
            rating: "",
            genre: "",
            read: "",
            description: "",
          },
        });
      });
  }

  editBook(id, title, author, rating, genre, read, description) {
    console.log(title);

    this.setState({
      editBookData: { id, title, author, rating, genre, read, description },
      editBookModal: !this.state.editBookModal,
    });
  }

  toggleEditBook() {
    this.setState({
      editBookModal: !this.state.editBookModal,
    });
  }

  handleEditClose() {
    this.setState({
      editBookModal: !this.state.editBookModal,
    });
  }

  updateBook(e) {

   e.preventDefault();
    axios
      .patch(
        'http://localhost:3000/books/' + this.state.editBookData.id  ,{ headers: { "Content-Type": "application/json" } },
      
        {
         
          title: this.state.editBookData.title,
          author: this.state.editBookData.author,
          rating: this.state.editBookData.rating,
          genre: this.state.editBookData.genre,
          read: this.state.editBookData.read,
          description: this.state.editBookData.description,
          
        }
      )
      .then((response) => {

        this._refreshBooks();
        this.setState({
          editBookModal: !this.state.editBookModal,
        //   editBookData: {
        //     id: "",
        //     title: "",
        //     author: "",
        //     rating: "",
        //     genre: "",
        //     read: "",
        //     description: "",
        //   },
        });
        console.log(response.data);
      });
  }

  deleteBook(id) {
    axios.delete("http://localhost:3000/books/" + id).then((response) => {
      this._refreshBooks();
    });
  }

  _refreshBooks() {
    axios
      .get("http://localhost:3000/books " , {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        this.setState({
          books: response.data,
        });
      });
  }

  render() {
    const { classes } = this.props;
    let books = this.state.books.map((book) => {
      return (
        <TableRow key={book.id}>
          <TableCell component="th" scope="row">
            {book.title}
          </TableCell>
          <TableCell align="right">{book.description} </TableCell>

          <TableCell align="right">{book.author} </TableCell>
          <TableCell align="right">{book.rating}</TableCell>
          <TableCell align="right">{book.genre}</TableCell>
          <TableCell align="right">{book.read}</TableCell>
          <TableCell align="center">
            <Button
              onClick={this.editBook.bind(
                this,
                book.id,
                book.title,
                book.author,
                book.rating,
                book.genre,
                book.read,
                book.description
              )}
            >
              Edit
            </Button>
            <Button onClick={this.deleteBook.bind(this, book.id)}>
              Delete
            </Button>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div>
        <h1>MY BOOK APP</h1>
        <Button
          className={classes.addButton}
          onClick={this.toggleNewBook.bind(this)}
        >
          Add Book
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={this.state.newBookModal}
          onClose={this.handleClose.bind(this)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div className={classes.paper}>
            <h4>Add a new book</h4>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="title"
                label="Title"
                value={this.state.newBookData.title}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.title = e.target.value;
                  this.setState({ newBookData });
                }}
              />

              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="author"
                label="Author"
                value={this.state.newBookData.author}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.author = e.target.value;
                  this.setState({ newBookData });
                }}
              />

              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="rating"
                label="Rating"
                value={this.state.newBookData.rating}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.rating = e.target.value;
                  this.setState({ newBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="genre"
                label="Genre"
                value={this.state.newBookData.genre}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.genre = e.target.value;
                  this.setState({ newBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="read"
                label="Read"
                value={this.state.newBookData.read}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.read = e.target.value;
                  this.setState({ newBookData });
                }}
              />

              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="description "
                label="Description"
                multiline
                rowsMax={4}
                value={this.state.newBookData.description}
                onChange={(e) => {
                  let { newBookData } = this.state;
                  newBookData.description = e.target.value;
                  this.setState({ newBookData });
                }}
              />
            </form>
            <Button
              className={classes.cancelButton}
              onClick={this.handleClose.bind(this)}
            >
              Cancel{" "}
            </Button>
            <Button
              className={classes.cancelButton}
              onClick={this.addBook.bind(this)}
            >
              Add Book{" "}
            </Button>
          </div>
        </Modal>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={this.state.editBookModal}
          onClose={this.handleEditClose.bind(this)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div className={classes.paper}>
            <h4>Edit a book</h4>
            <form className={classes.root} noValidate autoComplete="off">
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="title"
                label="Title"
                value={this.state.editBookData.title}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.title = e.target.value;
                  this.setState({ editBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="author"
                label="Author"
                value={this.state.editBookData.author}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.author = e.target.value;
                  this.setState({ editBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="rating"
                label="Rating"
                value={this.state.editBookData.rating}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.rating = e.target.value;
                  this.setState({ editBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="genre"
                label="Genre"
                value={this.state.editBookData.genre}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.genre = e.target.value;
                  this.setState({ editBookData });
                }}
              />
              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="read"
                label="Read"
                value={this.state.editBookData.read}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.read = e.target.value;
                  this.setState({ editBookData });
                }}
              />

              <TextField
                className={clsx(classes.margin, classes.textField)}
                id="description "
                label="Description"
                rowsMax={4}
                multiline
                value={this.state.editBookData.description}
                onChange={(e) => {
                  let { editBookData } = this.state;
                  editBookData.description = e.target.value;
                  this.setState({ editBookData });
                }}
              />
            </form>
            <Button
              className={classes.cancelButton}
              onClick={this.handleEditClose.bind(this)}
            >
              Cancel{" "}
            </Button>
            <Button
              className={classes.cancelButton}
              onClick={this.updateBook.bind(this)}
            >
              Update{" "}
            </Button>
          </div>
        </Modal>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align = "center">Title</TableCell>
                <TableCell align="center"> Description</TableCell>
                <TableCell align="right">Author</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Genre</TableCell>
                <TableCell align="right">Read</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{books}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Books);
