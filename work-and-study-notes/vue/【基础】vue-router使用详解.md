# 前言
在解析`Vue Router`的源码时发现一些特殊的路由匹配解析规则，在观看官方文档时，发现很多没用过的新奇特性，因此编写本文作为`Vue Router`官方文档的总结，以便后面开发能够快速借助此文章找到想要的东西

# router-link和router-view
## router-link
使用自定义组件 `router-link` 来创建链接，使得 `Vue Router` 可以在不重新加载页面的情况下更改 `URL`，处理 `URL` 的生成以及编码。

## router-view
`router-view` 将显示与 `url` 对应的组件。你可以把它放在任何地方，以适应你的布局

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
## 重定向
```javascript
// 重定向的目标可以是一个路径
const routes = [{ path: '/home', redirect: '/' }]
// 重定向的目标也可以是一个命名的路由
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]
// 可以使用function，动态返回重定向目标
const routes = [
    {
        // /search/screens -> /search?q=screens
        path: '/search/:searchText',
        redirect: to => {
            // 方法接收目标路由作为参数
            // return 重定向的字符串路径/路径对象
            return { path: '/search', query: { q: to.params.searchText } }
        },
    }
]
// 可以使用function，重定向到相对位置
const routes = [
    {
        // 将总是把/users/123/posts重定向到/users/123/profile。
        path: '/users/:id/posts',
        redirect: to => {
            // 该函数接收目标路由作为参数
            // 相对位置不以`/`开头
            // 或 { path: 'profile'}
            return 'profile'
        },
    },
]
```

## 别名
类似重定向的一种模式
比如，将 `/` 别名为 `/home`，意味着当用户访问 `/home` 时，URL 仍然是 `/home`，但会被匹配为用户正在访问 `/`
```javascript
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

别名可以使用数组表示多个
```javascript
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // 为这 3 个 URL 呈现 UserList
      // - /users
      // - /users/list
      // - /people
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

别名也可以使用动态映射
```javascript
const routes = [
  {
    path: '/users/:id',
    component: UsersByIdLayout,
    children: [
      // 为这 3 个 URL 呈现 UserDetails
      // - /users/24
      // - /users/24/profile
      // - /24
      { path: 'profile', component: UserDetails, alias: ['/:id', ''] },
    ],
  },
]
```
# (重要)路由组件之间的传参
## 路由params自动转化为props
注意要`routes`声明`props: true`才能自动转化
```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]

// 上面可以替换成为下面这段代码

const User = {
    // 请确保添加一个与路由参数完全相同的 prop 名
    props: ['id'],
    template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]

```

遇到命名视图时，要分开声明`props: true`
```javascript
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```

## 在`routes`直接传递`props`
当 props 是一个对象时，它将原样设置为组件 props。当 props 是静态的时候很有用
```javascript
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }
  }
]
```
## 在`routes`将`query`转化为静态的`props`值
URL `/search?q=vue` 将传递 `{query: 'vue'}` 作为 `props` 传给 `SearchUser` 组件。
```javascript
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
```


# 导航守卫

注意`next`的正确调用
```javascript
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})

// GOOD
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
    else next()
})
```

## 全局前置守卫
> 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
>
> 全局前置守卫是检测授权逻辑的理想位置

你可以使用 router.beforeEach 注册一个全局前置守卫：
```javascript
const router = createRouter({ ... })
router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

## 全局解析守卫
> 因为它在 每次导航时都会触发，但是确保在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用。
> 
> router.beforeResolve 是获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。
```javascript
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

## 全局后置钩子
> 它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

这些钩子不会接受 next 函数也不会改变导航本身：
```javascript
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```
它们也反映了 navigation failures 作为第三个参数：
```javascript
router.afterEach((to, from, failure) => {
  if (!failure) sendToAnalytics(to.fullPath)
})
```

## 路由独享的守卫

### 组件beforeEnter

beforeEnter 守卫 只在进入路由时触发，不会在 params、query 或 hash 改变时触发。例如，从 /users/2 进入到 /users/3 或者从 /users/2#info 进入到 /users/2#projects。它们只有在 从一个不同的 路由导航时，才会被触发。

```javascript
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

### 组件内守卫

```javascript
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
```

`beforeRouteLeave`: 通常用来预防用户在还未保存修改前突然离开。该导航可以通过返回 false 来取消

```javascript
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}

beforeRouteUpdate (to, from) {
    // just use `this`
    this.name = to.params.name
}
beforeRouteLeave (to, from) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (!answer) return false
}
```

组合式API写法
```javascript
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

export default {
  setup() {
    // 与 beforeRouteLeave 相同，无法访问 `this`
    onBeforeRouteLeave((to, from) => {
      const answer = window.confirm(
        'Do you really want to leave? you have unsaved changes!'
      )
      // 取消导航并停留在同一页面上
      if (!answer) return false
    })

    const userData = ref()

    // 与 beforeRouteUpdate 相同，无法访问 `this`
    onBeforeRouteUpdate(async (to, from) => {
      //仅当 id 更改时才获取用户，例如仅 query 或 hash 值已更改
      if (to.params.id !== from.params.id) {
        userData.value = await fetchUser(to.params.id)
      }
    })
  },
}
```

## 完整的导航解析流程
1. 导航被触发。 
2. 在失活的组件里调用 beforeRouteLeave 守卫。 
3. 调用全局的 beforeEach 守卫。 
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。 
5. 在路由配置里调用 beforeEnter。 
6. 解析异步路由组件。 
7. 在被激活的组件里调用 beforeRouteEnter。 
8. 调用全局的 beforeResolve 守卫(2.5+)。 
9. 导航被确认。 
10. 调用全局的 afterEach 钩子。 
11. 触发 DOM 更新。 
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。



# 数据获取
- 导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示“加载中”之类的指示。
- 导航完成之前获取：导航完成前，在路由进入的守卫中获取数据，在数据获取成功后执行导航。 
从技术角度讲，两种方式都不错 —— 就看你想要的用户体验是哪种。

## 导航完成之后获取
```javascript
export default {
    data() {
        return {
            loading: false,
            post: null,
            error: null,
        }
    },
    created() {
        // watch 路由的参数，以便再次获取数据
        this.$watch(
            () => this.$route.params,
            () => {
                this.fetchData()
            },
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            {immediate: true}
        )
    }
}
```

## 在导航完成前获取数据

如果复用一个路由，比如`/user/:id`会导致不同的`path`会使用同一个路由，那么就不会调用`beforeRouteEnter`，因此我们需要在`beforeRouteUpdate`获取数据

```javascript
export default {
  data() {
    return {
      post: null,
      error: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  async beforeRouteUpdate(to, from) {
    this.post = null
    try {
      this.post = await getPost(to.params.id)
    } catch (error) {
      this.error = error.toString()
    }
  },
}
```



# useRouter和useRoute

route 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该避免监听整个 route 对象。在大多数情况下，你应该直接监听你期望改变的参数。
router具有`push`、`replace`等方法

```javascript
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

export default {
  setup() {
    const route = useRoute()
    const userData = ref()

    // 当参数更改时获取用户信息
    watch(
      () => route.params.id,
      async newId => {
        userData.value = await fetchUser(newId)
      }
    )
  },
}
```

# 切换不同路由时的动画效果
```javascript
const routes = [
  {
    path: '/custom-transition',
    component: PanelLeft,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/other-transition',
    component: PanelRight,
    meta: { transition: 'slide-right' },
  },
]
```
```vue
<router-view v-slot="{ Component, route }">
  <!-- 使用任何自定义过渡和回退到 `fade` -->
  <transition :name="route.meta.transition || 'fade'">
    <component :is="Component" />
  </transition>
</router-view>
```

也可以使用`afterEach`进行`meta`字段的赋值
```javascript
router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
```

# 滚动行为
使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：
> scrollBehavior 函数接收to和 from 路由对象，如 Navigation Guards。第三个参数 savedPosition，只有当这是一个 popstate 导航时才可用（由浏览器的后退/前进按钮触发）。

## 滚动到顶部
```javascript
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
      // return 期望滚动到哪个的位置
      // 始终滚动到顶部
      return { top: 0 }
  }
})
```

## 滚动到某一个元素的位置
```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终在元素 #main 上方滚动 10px
    return {
      // 也可以这么写
      // el: document.getElementById('main'),
      el: '#main',
      top: -10,
    }
  },
})
```

## 滚动到锚点
```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash, 
        behavior: 'smooth'//如果你的浏览器支持滚动行为，你可以让它变得更流畅
      }
    }
  },
})
```

## 不滚动/模仿原生滚动
1. 如果返回`false`，或者是一个空对象，那么不会发生滚动

2. 返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样：
```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
```


## 延迟滚动
```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 500)
    })
  },
})
```

# 打包分chunk
## webpack
webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

```javascript
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

## vite
在Vite中，你可以在rollupOptions下定义分块：
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          'group-user': [
            './src/UserDetails',
            './src/UserDashboard',
            './src/UserProfileEdit',
          ],
        },
      },
    },
  },
})
```

# 导航故障

## 触发router.push仍然留在原页面
- 用户已经位于他们正在尝试导航到的页面
- 一个导航守卫通过调用 return false 中断了这次导航
- 当前的导航守卫还没有完成时，一个新的导航守卫会出现了
- 一个导航守卫通过返回一个新的位置，重定向到其他地方 (例如，return '/login')
- 一个导航守卫抛出了一个 Error

## 使用promise检测是否导航跳转成功

```javascript
const navigationResult = await router.push('/my-profile')

if (navigationResult) {
  // 导航被阻止
} else {
  // 导航成功 (包括重新导航的情况)
  this.isMenuOpen = false
}
```

## 使用API提示用户跳转失败
```javascript
import { NavigationFailureType, isNavigationFailure } from 'vue-router'

// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?')
}
```

## 导航跳转失败类型
- `aborted`：在导航守卫中返回 `false` 中断了本次导航。
- `cancelled`： 在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 `router.push`。
- `duplicated`：导航被阻止，因为我们已经在目标位置了。
