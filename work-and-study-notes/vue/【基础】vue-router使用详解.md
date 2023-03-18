# 前言
在解析`Vue Router`的源码时发现一些特殊的路由匹配解析规则，在观看官方文档时，发现很多没用过的新奇特性，因此编写本文作为`Vue Router`官方文档的总结，以便后面开发能够快速借助此文章找到想要的东西


# 路由匹配规则
`Vue Router`官网提供的路径调试工具：https://paths.esm.dev/?p=AAMeJSyAwR4UbFDAFxAcAGAIJXMAAA

## 基础匹配
```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
```

## 带参数的动态路由匹配
```javascript
const routes = [
    // 动态字段以冒号开始
    { path: '/users/:id', component: User },
]
```
现在像 `/users/johnny` 和 `/users/jolyne` 这样的 URL 都会映射到同一个路由。

路径参数 用冒号 `:` 表示。当一个路由被匹配时，它的 params 的值将在每个组件中以 `this.$route.params` 的形式暴露出来

|  匹配模式   | 匹配路径  | $route.params |
|  ----  | ----  |----  |
| /users/:username  | /users/eduardo |  { username: 'eduardo' } |
| /users/:username/posts/:postId  | /users/eduardo/posts/123 |  { username: 'eduardo', postId: '123' } |


## 正则表达式路由

### 捕获所有路由或者404 Not found路由
常规参数只匹配 url 片段之间的字符，用 / 分隔。如果我们想匹配任意路径，我们可以使用自定义的 路径参数 正则表达式，在 路径参数 后面的括号中加入 正则表达式 :
```javascript
const routes = [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]
```

```javascript
const routes = [
    // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
    { path: '/user-:afterUser(.*)', component: UserGeneric }
]
```
### 匹配数字或者匹配其它内容的正则表达式
```javascript
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },
  // /:productName -> 匹配其他任何内容
  { path: '/:productName' },
]
```
现在，转到 /25 将匹配 /:orderId，其他情况将会匹配 /:productName。routes 数组的顺序并不重要!
### 匹配多个子路由
如果你需要匹配具有多个部分的路由，如 /first/second/third，你应该用 *（0 个或多个）和 +（1 个或多个）将参数标记为可重复：
```javascript
const routes = [
  // /:chapters ->  匹配 /one, /one/two, /one/two/three, 等
  { path: '/:chapters+' },
  // /:chapters -> 匹配 /, /one, /one/two, /one/two/three, 等
  { path: '/:chapters*' },
]
```
当我们使用上面这种写法时，我们通过`this.$router.params`拿到的数据就是数组了！
### 数字限制+多个子路由一起使用
```javascript
const routes = [
  // 仅匹配数字
  // 匹配 /1, /1/2, 等
  { path: '/:chapters(\\d+)+' },
  // 匹配 /, /1, /1/2, 等
  { path: '/:chapters(\\d+)*' },
]
```

### 可选子路由
你也可以通过使用 ? 修饰符(0 个或 1 个)将一个参数标记为可选：
```javascript
const routes = [
  // 匹配 /users 和 /users/posva
  { path: '/users/:userId?' },
  // 匹配 /users 和 /users/42
  { path: '/users/:userId(\\d+)?' },
]
```
> 请注意，* 在技术上也标志着一个参数是可选的，但 ? 参数不能重复。



# 路由sensitive和strict变量

默认情况下，所有路由是不区分大小写的，并且能匹配带有或不带有尾部斜线的路由。例如，路由 /users 将匹配 /users、/users/、甚至 /Users/

当使用`strict: true`时，不能匹配尾部斜线的路由
> 默认为`false`,意味着默认情况下，路由 /users 同时匹配 /users 和 /users/

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ],
  strict: true, // applies to all routes
})
```

当使用`sensitive: true`时，在乎大小写
> 默认为false,意味着默认情况下，路由 /users 同时匹配 /users 和 /Users
> 
> 注意可以单独应用于一个路由
```javascript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非：/Users/posva
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ], 
  strict: true, // applies to all routes
})
```


# 嵌套路由（子路由）
```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

当你访问 `/user/eduardo` 时，在 `User` 的 `router-view` 里面什么都不会呈现，因为没有匹配到嵌套路由。也许你确实想在那里渲染一些东西。在这种情况下，你可以提供一个空的嵌套路径
> 即你匹配到父路由的路径时，想要一个默认子路由，可以使用一个空的嵌套路径
```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      // 当 /user/:id 匹配成功
      // UserHome 将被渲染到 User 的 <router-view> 内部
      { path: '', component: UserHome },

      // ...其他子路由
    ],
  },
]
```

在一些场景中，你可能希望导航到命名路由而不导航到嵌套路由。例如，你想导航 /user/:id 而不显示嵌套路由。那样的话，你还可以命名父路由，但请注意重新加载页面将始终显示嵌套的子路由，因为它被视为指向路径/users/:id 的导航，而不是命名路由：
```javascript
const routes = [
    {
        path: '/user/:id',
        name: 'user-parent',
        component: User,
        children: [{ path: '', name: 'user', component: UserHome }],
    },
]
```

# 编程式导航
|  声明式   | 匹配路径  |
|  ----  | ----  |
| `<router-link :to="...">	`  | `router.push(...)` |

```javascript
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```
> 注意：如果提供了 path，params 会被忽略，一般是name+params(代表动态匹配那个参数名)，或者直接手写路径path
```javascript
const username = "eduardo";
router.push({ path: `/user/${username}` }) // -> /user/eduardo
// 如果可能的话，使用 `name` 和 `params` 从自动 URL 编码中获益
router.push({ name: 'user', params: { username } }) // -> /user/eduardo
```

# 命名视图
有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar (侧导航) 和 main (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
> 意味着我们一个`xxx.vue`文件中可以使用多个`<router-view/>`，然后使用多个路由配置适应它
```html
<router-view class="view left-sidebar" name="LeftSidebar"></router-view>
<router-view class="view main-content"></router-view>
<router-view class="view right-sidebar" name="RightSidebar"></router-view>
```

比如我们可以使用下面的`router`
- `path: 'emails'`具有上面三个`router-view`，会映射到`<router-view class="view main-content"></router-view>`
- `path: 'profile'`具有上面三个`router-view`，会分别映射到对应的`name`
```javascript
const router = {
    path: '/settings',
        // 你也可以在顶级路由就配置命名视图
    component: UserSettings,
    children: [
        {
            path: 'emails',
            component: UserEmailsSubscriptions
        }, 
        {
            path: 'profile',
            components: {
                LeftSidebar: LeftSidebar,
                RightSidebar: RightSidebar,
                default: MiddleConent
            }
        }
    ]
}
```

# 重定向和别名
