(function () {
    Vue.component("big-image", {
        template: "#big-image",
        props: ["id"],
        data: () => {
            return {
                image: {},
            };
        },
        /* methods: {
            closeBigImage() {
                this.$emit("close");
            },
        }, */
        mounted() {
            axios
                .get(`/images/${this.id}`)
                .then((response) => {
                    this.image = response.data;
                })
                .catch((err) => console.log("Error getting File:", err));
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            bigImage: null,
            showUpload: false,
            error: false,
            form: {
                title: "",
                description: "",
                username: "",
                file: "",
            },
        },
        methods: {
            resetForm() {
                for (let field in this.form) {
                    this.form[field] = "";
                }
            },
            handleFile(event) {
                this.form.file = event.target.files[0];
            },
            handleUpload() {
                this.error = false;
                const formData = new FormData();

                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                formData.append("file", this.form.file);

                axios
                    .post("/upload", formData)
                    .then((response) => {
                        this.images.unshift(response.data);
                        for (let field in this.form) {
                            this.form[field] = "";
                        }
                        this.showUpload = false;
                    })
                    .catch((err) => (this.error = err));
            },
        },
        mounted() {
            axios.get("/images").then((response) => {
                response.data.sort((a, b) => {
                    return a.created_at < b.created_at;
                });
                this.images = response.data;
            });
        },
    });
})();
