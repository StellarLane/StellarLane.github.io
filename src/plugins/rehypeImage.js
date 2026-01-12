import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import { site } from '../config.json'

export function rehypeImage() {
  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'p' && node.children.length === 1) {
        const child = node.children[0]
        if (child.tagName === 'img') {
          parent.children[index] = buildFigure(child)
        }
      } else if (node.tagName === 'img') {
        parent.children[index] = buildImage(node)
      }
    })
  }
}

function buildImage(node) {
  const imgProps = node.properties
  let src = imgProps.src

  // 如果配置了 CDN 且图片路径以 / 开头（说明是本地资源）
  if (site.cdn && src && src.startsWith('/')) {
    src = site.cdn + src
  }

  return h('img', { ...imgProps, src, loading: 'lazy' })
}

function buildFigure(node) {
  let imgTitle = node.properties.title
  if (imgTitle) {
    imgTitle = imgTitle.trim()
  }

  return h('figure', null, [buildImage(node), imgTitle ? h('figcaption', imgTitle) : null])
}
