import {
  openBlock,
  createBlock,
  Teleport,
  h,
  createCommentVNode,
  withCtx,
  createVNode,
  Transition,
  renderSlot,
} from "vue";
import { gsap, Elastic } from "gsap";

var script = {
  inheritAttrs: false,
  props: {
    show: Boolean,
  },
  emit: ["update:show", "open", "close"],
  data() {
    return {
      containerShow: this.show,
    };
  },
  modal: null,
  methods: {
    open() {
      this.$emit("open");
    },
    close() {
      this.$emit("update:show", false);
    },
    modalRef(el) {
      this.modal = el;
    },
    onModalClick(event) {
      if (this.modal === event.target) this.close();
    },
    onBeforeEnter(el) {
      gsap.set(el, {
        scale: 0,
        opacity: 0,
      });
    },
    onEnter(el, done) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: Elastic.easeOut.config(0.3, 0.2),
        onComplete: () => [this.$emit("open"), done],
      });
    },
    onLeave(el, done) {
      gsap.to(el, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        ease: Elastic.easeOut.config(0.3, 0.2),
        onComplete: () => [
          (this.containerShow = false),
          done,
          this.$emit("close"),
        ],
      });
    },
    onBeforeEnterOverlay(el) {
      gsap.set(el, {
        opacity: 0,
      });
    },
    onEnterOverlay(el, done) {
      gsap.to(el, {
        opacity: 0.3,
        duration: 0.25,
        onComplete: done,
      });
    },
    onLeaveOverlay(el, done) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        onComplete: done,
      });
    },
  },
  updated() {
    if (this.show) {
      this.containerShow = this.show;
    }
  },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    openBlock(),
    createBlock(
      Teleport,
      {
        to: "body",
      },
      [
        $data.containerShow
          ? (openBlock(),
            createBlock(
              "div",
              {
                style: {
                  position: "fixed",
                  top: 0,
                  left: 0,
                },
              },
              [
                createVNode(
                  Transition,
                  {
                    onBeforeEnter: $options.onBeforeEnterOverlay,
                    onEnter: $options.onEnterOverlay,
                    onLeave: $options.onLeaveOverlay,
                    appear: "",
                  },
                  {
                    default: withCtx(() => [
                      $props.show
                        ? h("div", {
                            style: {
                              position: "fixed",
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgb(0,0,0)",
                            },
                            onClick: $options.close,
                          })
                        : createCommentVNode("", true),
                    ]),
                  }
                ),
                createVNode(
                  Transition,
                  {
                    onBeforeEnter: $options.onBeforeEnter,
                    onEnter: $options.onEnter,
                    onLeave: $options.onLeave,
                    appear: "",
                  },
                  {
                    default: withCtx(() => [
                      $props.show
                        ? h(
                            "div",
                            {
                              style: {
                                width: "100vw",
                                height: "100vh",
                                display: "flex",
                              },
                              ref: $options.modalRef,
                              onClick:
                                _cache[1] ||
                                (_cache[1] = (...args) =>
                                  $options.onModalClick &&
                                  $options.onModalClick(...args)),
                            },
                            [renderSlot(_ctx.$slots, "default")]
                          )
                        : createCommentVNode("", true),
                    ]),
                  }
                ),
              ]
            ))
          : createCommentVNode("", true),
      ]
    )
  );
}

script.render = render;
script._file = "modal/modal.vue";
export default script;
