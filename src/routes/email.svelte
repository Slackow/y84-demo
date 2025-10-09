<script lang="ts">
	let { link }: { link: string } = $props();
</script>

<style>
    a {
        -webkit-font-smoothing: antialiased;
        font-family: Netflix Sans,Helvetica Neue,Segoe UI,Roboto,Ubuntu,sans-serif;
        text-align: left;
        align-items: center;
        background-color: darkred;
        border-radius: 5px;
        color: #fff;
        display: inline-flex;
        font-weight: 700;
        margin-top: 10px;
        padding: 8px 12px;
        text-decoration: none;
        transition: background-color .3s ease;
        height: 25px;
    }
		a:hover {
				background-color: #680000;
		}
    img {
        width: 20px;
        padding-right: 5px;
    }
</style>

<a href={link} target="_blank"><img src="/email.svg" alt="">Email</a>
