module.exports = {
	title: 'yiluhuakai',
	//description: 'Just playing around',
	themeConfig: {
		// logo: '/assets/img/logo.jpeg',
		//  导航栏链接
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'LeetCode', link: '/leetcode/' },
			{ text: 'Go', link: '/golang/' },
			{ text: 'C语言', link: '/clang/lin/' },
			{ text: '前端', link: 'https://google.com/3' }
			//  下拉列表
			// {
			// 	text: 'Languages',
			// 	ariaLabel: 'Language Menu',
			// 	items: [
			// 		{ text: 'Chinese', link: '/language/chinese/' },
			// 		{ text: 'Japanese', link: '/language/japanese/' }
			// 	]
			// }
		],
		//sidebar: 'auto',
		sidebar: {
			// '/leetcode/': ['' /* /readme.html/ */, 'link' /* /leetcode/link.html */, 'array' /* /leetcode/array.html */]
		},
		//sidebarDepth:, // 侧边栏显示2级
		//  展示所有级别的标题
		displayAllHeaders: true,
		//设置最后的更新时间
		lastUpdated: 'Last Updated' // string | boolean，
		// 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
		//repo: 'vuejs/vuepress'
		// 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
		// "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
		// repoLabel: '查看源码',
		// //  页面滚动效果
		// smoothScroll: true,
	},
	// markdown的配置
	markdown: {
		lineNumbers: true
	},
	plugins: ['@vuepress/active-header-links', 'autobar']
}
