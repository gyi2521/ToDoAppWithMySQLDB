$(document).ready(function() {

  var $newItemInput = $("input.new-item");
  var $todoContainer = $(".todo-container");

  $(document).on("click", "button.delete", deleteTodo);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("submit", "#todo-form", insertTodo);

  // Our initial todos array
  var todos = [];

  // Getting todos from database when page loads
  getTodos();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    $todoContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < todos.length; i++) {
      rowsToAdd.push(createNewRow(todos[i]));
    }
    $todoContainer.prepend(rowsToAdd);
  }

  // This function grabs todos from the database and updates the view
  function getTodos() {
    $.get("/api/todos", function(data) {
      todos = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteTodo(event) {
    event.stopPropagation();
    var todoId = $(this).data("id");
    let toDoText = $(this).closest('p').find('span').text().trim();
    let chk = $(this).find('.fa-circle');
    if(chk.length > 0){
      console.log("here1"); 
      chk.removeClass('fa-circle');
      chk.addClass('fa-dot-circle');
      let todo = {
        text:toDoText,
        complete:true,
        id:todoId
      }
      updateTodo(todo);
    }else{
        $.ajax({
          method: "DELETE",
          url: "/api/todos/" + todoId
        }).then(getTodos);      
    }
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    var todo = $(this).parent().data("todo");
    todo.complete = !todo.complete;
    updateTodo(todo);
  }

  //This function updates a todo in our database
  function updateTodo(todo) {
    $.ajax({
      method: "PUT",
      url: "/api/todos",
      data: todo
    }).then(getTodos);
  }

  // This function constructs a todo-item row
  function createNewRow(todo) {
    var $newInputRow = $(
      `<p class='list-group-item todo-item'>
      <button class='delete'><i ${todo.complete? "class='far fa-dot-circle btn-style'":"class='far fa-circle btn-style'"}></i></button>
      <span> ${todo.text}</span></p><br />`
    );

    $newInputRow.find("button.delete").data("id", todo.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("todo", todo);
    // if (todo.complete) {
    //   $newInputRow.find("span").css("text-decoration", "line-through");
    // }
    return $newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertTodo(event) {
    event.preventDefault();
    var todo = {
      text: $newItemInput.val().trim(),
      complete: false
    };
    
    if (todo.text != ''){
      $.post("/api/todos", todo, getTodos);
      $newItemInput.val("");
    }
  }
});
