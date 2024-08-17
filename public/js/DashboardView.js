/**
 * Function to display the loader
 */
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

/**
 * Function to hide the loader
 */
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
showLoader();
window.addEventListener("load", function () {
    hideLoader();
});
