import { defineComponent } from "vue";
import Index from "./Index.vue";
import Home from "./Home.vue";
export default defineComponent({
    components: [Index],
    setup() {
        return () => {
            return (
               <div>
                   <div>这是App.jsx</div>
                   <Index></Index>
                   <Home></Home>
               </div>
            )
        };
    },
});
