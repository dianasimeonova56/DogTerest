import { html, render } from '../../node_modules/lit-html/lit-html.js'

export const likeTemplate = (like) => {
    const date = like.created_at;
    const dateObj = new Date(date.replace(" ", "T"));
    const formattedDate = `${dateObj.getDate()}.${dateObj.getMonth() + 1}`;
 
    return html`
       <div class="like-entry">
         <p>
            <a href="/profile/${like.user_id}">${like.user_first_name} ${like.user_last_name}</a> liked this
         </p>
         <span class="like-date">${formattedDate}</span>
      </div>
    `;
 };