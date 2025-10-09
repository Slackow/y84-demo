<script lang="ts">
	let { link }: { link: string } = $props();
</script>

<style>
	a {
      -webkit-font-smoothing: antialiased;
      font-family: Netflix Sans,Helvetica Neue,Segoe UI,Roboto,Ubuntu,sans-serif;
      text-align: left;
      align-items: center;
      background-color: #111111;
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
	img {
			width: 20px;
			padding-right: 5px;
	}
	a:hover {
			background-color: #000000;
	}
</style>

<a href={link} target="_blank"><img src="/github-mark-white.svg" alt="">GitHub</a>
