const router = require('./router/router')
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
			{ text: 'Mysql', link: '/mysql/' },
			{ text: 'C语言', link: '/clang/' },
			{ text: '前端', link: '/es/' },
			{ text: 'nodejs', link: '/nodejs/' },
			{
				text: 'React',
				link: '/react/'
			},
			{
				text: 'Java',
				link: '/java/'
			}
		],
		//sidebar: 'auto',
		sidebar: router,
		sidebarDepth: 4, // 侧边栏显示2级
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
		lineNumbers: true,
		//toc: { includeLevel: [1, 2, 3, 4, 5] },
		extendMarkdown: md => {
			md.use(require('markdown-it-table-of-contents'), {
				includeLevel: [1, 2, 3, 4, 5]
			})
		},
		extractHeaders: ['h2', 'h3', 'h4']
	},
	plugins: ['@vuepress/active-header-links'],
	extraWatchFiles: [
		'.vuepress/router/router.js' // 使用相对路径
	]
}
