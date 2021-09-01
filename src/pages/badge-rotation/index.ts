export interface InertiaAnimationOptions {
  /**
   * 初速度
   */
  speed?: number
  /**
   * 水平重力影响系数
   */
  gravity?: number
  /**
   * 衰减系数
   */
  u?: number
  /**
   * 最后可忽略的速度
   */
  toleratedSpeed?: number
  /**
   * 最后可忽略的角度
   */
  toleratedAngel?: number
  /**
   * 每帧时间（以保持不同帧数设备衰减表现一致）
   */
  frameDuration: number
  /**
   * 获取旋转角度
   */
  getRotation?: () => number
  /**
   * 设置旋转的动画
   */
  setRotation?: (deltaRotation: number) => void
}

/**
 * 创建旋转惯性动画
 *
 * @param {*} options
 * @param {Function} callback 回调函数 设置状态
 */
export function createInertiaAnimation(options: InertiaAnimationOptions) {
  return {
    /**
     * 是否正在播放
     */
    isPlaying: false,
    /**
     * 是否允许播放动画
     */
    playAnimation: true,
    /**
     * 初速度
     */
    speed: 1,
    /**
     * 水平重力影响系数
     */
    gravity: 0.008,
    /**
     * 衰减系数
     */
    u: 0.92,
    /**
     * 最后可忽略的速度
     */
    toleratedSpeed: 0.0005,
    toleratedAngel: 3,
    /**
     * 每帧时间（以保持不同帧数设备衰减表现一致）
     */
    frameDuration: 16.67,
    /**
     * 获取旋转角度
     * @returns
     */
    getRotation() {
      console.log('您需要设置「getRotation」以获取旋转角度')
      return 0
    },
    /**
     * 设置旋转的动画
     * @param {number} rotation
     */
    setRotation() {
      console.log('您需要设置「setRotation」以设置旋转角度')
    },
    ...options,
    run() {
      // 上一次时间
      let lastTime: number | undefined

      let { speed } = this
      const {
        gravity,
        u,
        toleratedSpeed,
        toleratedAngel,
        frameDuration,
        getRotation,
        setRotation,
      } = this

      /**
       * 每一步动画
       * @param {number} timestamp
       */
      const step = (timestamp: number) => {
        const remainder = getRotation() % 180
        const positiveRemainder = remainder < 0 ? remainder + 180 : remainder

        if (positiveRemainder >= 90 && positiveRemainder < 180) speed -= gravity
        else if (positiveRemainder > 0 && positiveRemainder < 90)
          speed += gravity

        // 一般 60 帧，iPhone 省电模式变为 30 帧，会导致比此前衰减的慢。

        // 默认 16 ms
        let elapsed = 16.67

        if (lastTime)
          elapsed = timestamp - lastTime
        else lastTime = timestamp

        // 帧数过低
        speed *= Math.pow(u, elapsed / frameDuration)

        if (
          this.playAnimation
          && (Math.abs(speed) > toleratedSpeed
            || (positiveRemainder > toleratedAngel
              && positiveRemainder < 180 - toleratedAngel))
        ) {
          this.isPlaying = true

          lastTime = timestamp

          const deltaRotation = speed * elapsed
          setRotation(deltaRotation)

          window.requestAnimationFrame(step)
        }
        else {
          this.isPlaying = false
        }
      }

      window.requestAnimationFrame(step)
      this.isPlaying = false
    },
  }
}
