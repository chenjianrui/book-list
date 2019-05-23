class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Storage.getBooks();
    books.forEach(book => {
      UI.addBook(book);
    });
  }
  static addBook(book) {
    const bookList = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    bookList.appendChild(row);
  }
  static delBook(element) {
    if (element.classList.contains('delete')) {
      console.log(element.parentElement.previousElementSibling.textContent);
      const bookList = document.querySelector('#book-list');
      bookList.removeChild(element.parentElement.parentElement);
      Storage.removeBook(
        element.parentElement.parentElement.children[2].innerText
      );
    }
  }
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.classList.add('alert', `alert-${className}`);
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }
}

class Storage {
  static getBooks() {
    let books =
      localStorage.getItem('books') === null
        ? []
        : JSON.parse(localStorage.getItem('books'));
    return books;
  }

  static addBook(book) {
    const books = [...Storage.getBooks(), book];
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();
    const newBooks = books.filter(book => book.isbn !== isbn);
    localStorage.setItem('books', JSON.stringify(newBooks));
  }
}
document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  if (title === '' || author === '' || isbn === '') {
    UI.showAlert(`can not any form of`, 'danger');
  } else {
    const book = new Book(title, author, isbn);
    UI.showAlert('good', 'success');
    UI.addBook(book);
    Storage.addBook(book);
    UI.clearFields();
  }
});

document.querySelector('#book-list').addEventListener('click', e => {
  UI.delBook(e.target);
  UI.showAlert('Remove Book', 'success');
});
