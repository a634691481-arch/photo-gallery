import PhotoSwipe from 'photoswipe'
import type { DataSource } from 'photoswipe'

export function usePhotoSwipe() {
  let pswp: PhotoSwipe | null = null
  let onChangeCb: ((index: number) => void) | null = null
  let onCloseCb: (() => void) | null = null

  function open(
    items: DataSource,
    index: number = 0,
    opts?: {
      onChange?: (index: number) => void
      onClose?: () => void
    },
  ) {
    destroy()

    onChangeCb = opts?.onChange || null
    onCloseCb = opts?.onClose || null

    pswp = new PhotoSwipe({
      dataSource: items,
      index,
      bgOpacity: 0.96,
      spacing: 0.12,
      allowPanToNext: false,
      loop: false,
      pinchToClose: true,
      closeOnVerticalDrag: true,
      showHideAnimationType: 'fade',
      showAnimationDuration: 333,
      hideAnimationDuration: 333,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      arrowKeys: true,
      escKey: true,
      clickToCloseNonZoomable: true,
      imageClickAction: 'toggle-controls',
      bgClickAction: 'close',
      tapAction: 'toggle-controls',
      doubleTapAction: 'zoom',
      indexIndicatorSep: ' / ',
      preloaderDelay: 200,
      mainClass: 'pswp--photo-gallery',
      closeTitle: '关闭',
      zoomTitle: '缩放',
      arrowPrevTitle: '上一张',
      arrowNextTitle: '下一张',
    })

    pswp.on('close', () => {
      onCloseCb?.()
      destroy()
    })

    pswp.on('change', () => {
      onChangeCb?.(pswp?.currIndex ?? 0)
    })

    pswp.init()
  }

  function destroy() {
    if (pswp) {
      pswp.destroy()
      pswp = null
    }
  }

  function goTo(index: number) {
    pswp?.goTo(index)
  }

  onUnmounted(() => {
    destroy()
    onChangeCb = null
    onCloseCb = null
  })

  return { open, destroy, goTo, getPswp: () => pswp }
}
