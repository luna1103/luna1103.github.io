let entries = null;
let entriesPageBuilt = false;

function navigate()
{
    let hash = location.hash.replace(/^#!\//, "");
    let page = hash.split("/")[0];

    let container = document.getElementById(`page-${page}`);
    if (container)
    {
        document.querySelector(".active").classList.remove("active");
        container.classList.add("active");
    }

    switch (page)
    {
        case "entries":
            if (!entriesPageBuilt)
                buildEntries();
            break;
        case "entry":
        {
            let entry = hash.split("/")[1];
            buildEntryPage(entry);
        }
    }
}

async function loadEntries()
{
    if (!entries)
        entries = await (await fetch("/data/entries.json")).json();
}

async function buildEntries()
{
    await loadEntries();
    let html = "";
    for (const entry of entries)
    {
        html += `
        <div class="entry">
            <a href="#!/entry/${entry.id}" class="entry-title">
                ${entry.title ?? entry.date}
            </a>
            <span class="entry-date">
                added ${entry.date}
            </span>
        </div>
        `;
    }
    document.getElementById("entries-container").innerHTML = html;
    entriesPageBuilt = true;
}

async function buildEntryPage(entryId)
{
    document.getElementById("page-entry").innerHTML = `
    <p class="loader">working...</p>
    `;

    await loadEntries();
    let entry = null;
    for (const ent of entries)
    {
        if (ent.id == entryId)
            entry = ent;
            break;
    }
    if (!entry)
        return;

    let html = await (await fetch(`/data/entries/${entry.id}.html`)).text();

    document.getElementById("page-entry").innerHTML = `
    <div class="entry-header">
        <p class="page-title">${entry.title ?? entry.date}</p>
        <p class="entry-date">added ${entry.date}</p>
    </div>
    ${html}
    `;
}

window.addEventListener("hashchange", navigate);
navigate();