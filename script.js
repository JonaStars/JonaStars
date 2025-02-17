let clickCount = 0;

document.getElementById('clickButton').addEventListener('click', () => {
    clickCount++;
    document.getElementById('clickCount').textContent = clickCount;
});
