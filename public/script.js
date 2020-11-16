(function () {
    new Vue({
        el: "#main",
        data: {
            name: "Sesam",
            images: [],
        },
        mounted() {
            axios
                .get("/images")
                .then((response) => (this.images = response.data));
        },
    });
})();
