//geeting html form item by ids
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsContainer = document.getElementById('comments');

// Load comments from local storage or initialize with an empty array
let comments = JSON.parse(localStorage.getItem('comments')) || [];

// Recursive function to render comments and their replies
function renderComment(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
          <p>${comment.text}<span>
            <button class="reply-button btn btn1">Reply</button>
            <button class="edit-button btn btn3">Edit</button>
            <button class="delete-button btn btn2">Delete comment</button>
          </span></p>
          <div style="margin-left: 1.5rem; background-color: rgba(255, 99, 71, 0.5);" class="replies"></div>
        `;

    // targeting all the buttons
    const replyButton = commentElement.querySelector('.reply-button');
    const deleteButton = commentElement.querySelector('.delete-button');
    const repliesContainer = commentElement.querySelector('.replies');
    const editButton = commentElement.querySelector('.edit-button');
    // Adding event listeners
    replyButton.addEventListener('click', () => {
        const replyText = prompt('Enter your reply:');
        if (replyText) {
            const newReply = {
                text: replyText,
                replies: []
            };
            comment.replies.push(newReply);
            localStorage.setItem('comments', JSON.stringify(comments));
            renderComment(newReply);
            // Recursively render the new reply
            window.location.reload();


        }
    });

    //edit button function

    editButton.addEventListener('click', () => {
        const newText = prompt('Edit the comment:', comment.text);
        if (newText !== null) {
            comment.text = newText;
            localStorage.setItem('comments', JSON.stringify(comments));
            renderComments();
        }
    });

    //delete btn function
    deleteButton.addEventListener('click', () => {
        const parentComment = findParentComment(comments, comment);
        if (parentComment) {
            const replyIndex = parentComment.replies.indexOf(comment);
            let msg = "press ok to delete";

            //confirm delete asking
            if (confirm(msg) == true) {
                if (replyIndex !== -1) {
                    parentComment.replies.splice(replyIndex, 1);
                    localStorage.setItem('comments', JSON.stringify(comments));

                    // Re-render all comments after delete
                    renderComments();
                }

            }

        }

        const commentIndex = comments.indexOf(comment);
        let msg = "press ok to delete";
        //confirm delete asking
        if (confirm(msg) == true) {
            if (commentIndex !== -1) {
                comments.splice(commentIndex, 1);
                localStorage.setItem('comments', JSON.stringify(comments));

                // Re-render all comments after delete
                renderComments();
            }

        }
    });

    //rendering reply
    renderReplies(comment.replies, repliesContainer);

    return commentElement;
}

function renderReplies(replies, container) {
    container.innerHTML = '';
    replies.forEach(reply => {
        const replyElement = renderComment(reply); // Recursive rendering of replies
        container.appendChild(replyElement);
    });
}

// Initial rendering of comments
function renderComments() {
    commentsContainer.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = renderComment(comment);
        commentsContainer.appendChild(commentElement);
    });
}

// Add new comment......via form

commentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const commentText = commentInput.value;
    if (commentText.trim() === '') return;

    const newComment = {
        text: commentText,
        replies: []
    };

    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));

    renderComments();
    commentInput.value = '';
});

// Initial rendering.......of comments

renderComments();

// function for traversing recursively for deleting the items inside the replies nested
function findParentComment(cArray, targetComment) {

    //using of for of loop for iterating the includes array replies inside nested array
    for (const comment of cArray) {
        if (comment.replies.includes(targetComment)) {
            return comment;
            //checking the array has replies...? 
        } else if (comment.replies.length > 0) {
            //recursive call for again inside array......
            const foundParent = findParentComment(comment.replies, targetComment);
            if (foundParent) {
                return foundParent;
            }
        }
    }

}
