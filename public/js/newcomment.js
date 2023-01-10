const newFormHandler = async (event) => {
  event.preventDefault();

  const content = document.querySelector('#newcomment').value.trim();

  const post_id = document.querySelector('#post-id').value.trim();
console.log(content, post_id)
  if (content && post_id) {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, post_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
console.log(response)
    if (response.ok) {
      // document.location.replace('/');
    } else {
      alert('Failed to create comment');
    }
  }
};


document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newFormHandler);

