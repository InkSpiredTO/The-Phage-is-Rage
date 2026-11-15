(() => {
    const levelPages = {
        anatomy: "anatomy.html",
        hunting: "hunting.html",
        saviors: "phage_saviors.html"
    };
    const completionKey = (level) => `the-phage-is-rage:${level}:complete`;
    const isComplete = (level) => localStorage.getItem(completionKey(level)) === "true";

    function updateLockedLinks() {
        document.querySelectorAll("[data-requires-completion]").forEach((link) => {
            const requiredLevel = link.dataset.requiresCompletion;
            const locked = !isComplete(requiredLevel);
            link.setAttribute("aria-disabled", String(locked));
            link.tabIndex = locked ? -1 : 0;
            link.classList.toggle("is-locked", locked);
            link.title = locked ? `Finish ${requiredLevel === "anatomy" ? "Meet a Phage" : "The Hunt"} to unlock this level.` : "";
        });
    }

    window.markLevelComplete = (level) => {
        if (!Object.prototype.hasOwnProperty.call(levelPages, level)) {
            throw new Error(`Unknown level: ${level}`);
        }

        localStorage.setItem(completionKey(level), "true");
        updateLockedLinks();
        window.dispatchEvent(new CustomEvent("level-completed", { detail: { level } }));
    };

    document.addEventListener("click", (event) => {
        const resetButton = event.target.closest("[data-reset-levels]");
        if (resetButton) {
            event.preventDefault();
            if (window.confirm("Reset all level progress? This will lock later levels again.")) {
                Object.keys(levelPages).forEach((level) => {
                    localStorage.removeItem(completionKey(level));
                });
                window.location.replace(levelPages.anatomy);
            }
            return;
        }

        const link = event.target.closest("a");
        if (!link) {
            return;
        }

        if (link.dataset.requiresCompletion && !isComplete(link.dataset.requiresCompletion)) {
            event.preventDefault();
            return;
        }

        if (link.dataset.completesLevel) {
            window.markLevelComplete(link.dataset.completesLevel);
        }
    });

    const requiredLevel = document.body.dataset.requiresLevel;
    if (requiredLevel && !isComplete(requiredLevel)) {
        window.location.replace(levelPages[requiredLevel] || levelPages.anatomy);
        return;
    }

    updateLockedLinks();
    window.addEventListener("storage", updateLockedLinks);
})();
