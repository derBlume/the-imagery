(function () {
    Vue.component("big-image", {
        template: "#big-image",
        props: ["id", "username"],
        data: function () {
            return {
                image: {},
                nextImage: null,
                prevImage: null,
                showComments: false,
            };
        },
        watch: {
            id() {
                this.getImage();
            },
            image() {
                this.image.created_at = new Date(
                    this.image.created_at
                ).toLocaleString();
                console.log(this.image.created_at);
            },
        },
        methods: {
            getImage() {
                axios
                    .get(`/images/${this.id}`)
                    .then((response) => {
                        const { image, prevImage, nextImage } = response.data;
                        this.image = image;
                        this.prevImage = prevImage ? prevImage.id : null;
                        this.nextImage = nextImage ? nextImage.id : null;
                    })
                    .catch((err) => {
                        this.$emit("close");
                        console.log("Error getting File:", err);
                    });
            },
            openPrevImage() {
                this.$emit("newimage", this.prevImage);
            },
            openNextImage() {
                this.$emit("newimage", this.nextImage);
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
            id() {
                this.getComments();
            },
            returnUsername() {
                this.$parent.$emit("usernamechanged", this.returnUsername);
            },
        },
        methods: {
            addComment() {
                axios
                    .post("/comment", { ...this.form, image_id: this.id })
                    .then((response) => {
                        this.comments.unshift(response.data);
                        this.form.text = "";
                    })
                    .catch((err) => console.log(err));
            },
            getComments() {
                axios
                    .get(`/comments/${this.id}`)
                    .then((response) => (this.comments = response.data))
                    .catch((err) => console.log(err));

                console.log("username in comment-section: ", this.username);
            },
        },
        mounted() {
            this.getComments();
            const commentSection = document.querySelector(
                ".big-image main .comment-section"
            );
            const commentHeader = document.querySelector(
                ".big-image main .comment-section .header"
            );

            commentHeader.addEventListener("click", () => {
                commentSection.classList.toggle("visible");
                commentHeader.classList.toggle("visible");
            });
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            bigImage: location.hash.slice(1),
            uploadForm: false,
            lastImageId: "",
            pagination: 6,
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
                        this.images.pop();
                        this.lastImageId = [...this.images].pop().id;
                        this.resetForm();
                        this.showUpload = false;
                    })
                    .catch((err) => (this.error = err));
            },
            getImages(numberOfPictures) {
                axios
                    .get(
                        `/images?lastId=${this.lastImageId}&number=${numberOfPictures}`
                    )
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
            this.getImages(this.pagination - 1);

            window.addEventListener("hashchange", () => {
                this.bigImage = location.hash.slice(1);
                console.log(this.bigImage);
            });
        },
    });
})();
