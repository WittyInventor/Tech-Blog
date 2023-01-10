const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#post-name').value.trim();
 
  const id = document.querySelector('#post-id').value.trim();

  const content = document.querySelector('#post-desc').value.trim();

  if (title && content) {
    const response = await fetch(`/api/post/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create post');
    }
  }
};
const delButtonHandler = async (event) => {
  event.preventDefault();
  const id = document.querySelector('#post-id').value.trim();

    const response = await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
  
};

document
  .querySelector('.edit-post-form')
  .addEventListener('submit', newFormHandler);

  document
  .querySelector('#deletebutton')
  .addEventListener('click', delButtonHandler);

