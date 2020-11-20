(function () {
    Vue.component("big-image", {
        template: "#big-image",
        props: ["id", "username"],
        data: function () {
            return {
                image: {},
            };
        },
        watch: {
            id() {
                console.log("watch id", this.id);

                this.getImage();
            },
        },
        methods: {
            getImage() {
                axios
                    .get(`/images/${this.id}`)
                    .then((response) => {
                        this.image = response.data;
                    })
                    .catch((err) => {
                        this.$emit("close");
                        console.log("Error getting File:", err);
                    });
            },
        },
        mounted() {
            console.log("username in big-image: ", this.username);

            this.getImage();
        },
    });

    Vue.component("comment-section", {
        template: "#comment-section",
        props: ["id", "username"],
        data: function () {
            console.log(this.username);
            return {
                comments: [],
                form: {
                    text: "",
                    username: this.username,
                },
            };
        },
        computed: {
            returnUsername() {
                return this.form.username;
            },
        },
        watch: {
            returnUsername() {
                this.$parent.$emit("usernamechanged", this.returnUsername);
            },
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

            console.log("username in comment-section: ", this.username);
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            bigImage: location.hash.slice(1),
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
            changeUsername(username) {
                this.form.username = username;
            },
            resetForm() {
                this.form.title = "";
                this.form.description = "";
                document.querySelector("input[type=file]").value = null;
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
                        this.resetForm();
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
            openBigImage(imageId) {
                location.hash = imageId;
                this.bigImage = imageId;
            },
            closeBigImage() {
                location.hash = "";
                this.bigImage = null;
            },
        },
        mounted() {
            this.getImages();

            window.addEventListener("hashchange", () => {
                this.bigImage = location.hash.slice(1);
                console.log(this.bigImage);
            });
        },
    });
})();
