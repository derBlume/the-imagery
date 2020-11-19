(function () {
    Vue.component("big-image", {
        template: "#big-image",
        props: ["id"],
        data: () => {
            return {
                image: {},
            };
        },
        mounted() {
            axios
                .get(`/images/${this.id}`)
                .then((response) => {
                    this.image = response.data;
                })
                .catch((err) => console.log("Error getting File:", err));
        },
    });

    Vue.component("comment-section", {
        template: "#comment-section",
        props: ["id"],
        data: () => {
            return {
                comments: [],
                form: {
                    text: "",
                    username: "",
                },
            };
        },
        methods: {
            addComment() {
                axios
                    .post("/comment", { ...this.form, image_id: this.id })
                    .then((response) => this.comments.unshift(response.data))
                    .catch((err) => console.log(err));
            },
        },
        mounted() {
            axios
                .get(`/comments/${this.id}`)
                .then((response) => (this.comments = response.data))
                .catch((err) => console.log(err));
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            bigImage: null,
            uploadForm: false,
            lastImageId: "",
            moreButton: true,
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
            getImages() {
                axios
                    .get(`/images?lastId=${this.lastImageId}`)
                    .then((response) => {
                        this.images = [...this.images, ...response.data.images];
                        this.lastImageId = [...this.images].pop().id;
                        if (
                            this.lastImageId == response.data.lastImageInDB.id
                        ) {
                            this.moreButton = false;
                        }
                    });
            },
        },
        mounted() {
            this.getImages();
        },
    });
})();
