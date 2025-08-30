
function StreakPage() {

    return (
        <>
            <header>
                <h1>Streak Saver</h1>
            </header>
            <main>
                <section class="task-done">
                    <p>Doing a task every day? Pin this page and click the green button daily to keep track of your
                        progress!
                        (If you forget to do the task, it will use up a freeze if available...)</p>
                    <button type="button" >Done!</button>
                    <div id="task-done-text"></div>
                    <div id="new-freezes"></div>
                    <div class="amounts">
                        <p id="streak-amount">Streak amount</p>
                        <p id="freeze-amount">Freeze amount</p>
                    </div>
                </section>
                <section class="options">
                    <p>Be careful, use this button only if you want to restart another task. It will reset your streak
                        and
                        freezes!</p>
                    <button type="button" onclick="resetData()">Reset</button>
                    <div id="reset-text"></div>
                    <label for="difficulty">Choose difficulty (how commited are you?):</label>
                    <select id="difficulty" onchange="updateDifficulty()">
                        <option value="easy">Not so...</option>
                        <option value="medium">Decently</option>
                        <option value="hard">Very!</option>
                    </select>
                </section>
            </main>
        </>
    );
}

export default StreakPage;
