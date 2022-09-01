var watch_list = {};
const watch_element = document.getElementById("watch");

function delete_vod(id) {
    chrome.runtime.sendMessage({ type: "delete", id: id }, function (response) {
        if (response.success) {
            delete watch_list[id]; // Remove the element locally

            document.getElementById(id).remove();
            document.getElementById(id + "-hr").remove();
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    // Fetch watching list from background
    chrome.runtime.sendMessage({ type: "fetch" }, function (response) {
        if (response.success) {
            watch_list = response.data;

            console.log(watch_list);
            console.log("Len : " + Object.keys(watch_list).length);

            for (const [id, vod] of Object.entries(watch_list)) {
                const title = vod["title"];
                const formatted_title = title.length > 38 ? title.substring(0, 38) + "..." : title;

                const start_time = toHHMMSS(vod["time"]);
                const end_time = toHHMMSS(vod["max_time"]);

                const element = `
                    <li class="watch_vod" id="${id}">
                        <div class="information">
                            <div class="title" title="${title}">${formatted_title}</div>
                            <div class="meta">
                                <div class="channel_name">Chaine: ${vod["channel"]}</div>
                            </div>
                        </div>
                        <div class="utilities">
                            <div class="btn">
                                <button title="Continuer">
                                    <a href="https://www.twitch.tv/videos/${vod["link"]}" target="_blank">Watch</a>
                                </button>
                                <button title="Supprimer" class="delete_btn" id="${id}">X</button>
                            </div>
                
                            <div class="duration">${start_time} / ${end_time}</div>
                        </div>
                    </li>
                    <hr id="${id}-hr">
                `;

                watch_element.innerHTML += element;
            }

            const delete_btns = document.querySelectorAll("button[class='delete_btn']");
            delete_btns.forEach(btn => {
                btn.onclick = function (e) {
                    delete_vod(e.target.id);
                };
            });

        }
    });
});

// Format time and max_time
function toHHMMSS(sec_num) {
    const date = new Date(0);
    date.setSeconds(sec_num);
    const hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? "0" + date.getUTCHours() : date.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
}
