// A URL usa números a partir de 1; os componentes usam índices a partir de 0.
export function getSlideIndex(number, slideCount) {
  const slideNumber = Number.isFinite(number) ? Math.floor(number) : 1
  return Math.min(slideCount - 1, Math.max(0, slideNumber - 1))
}

export function getSlideHash(index, slideCount) {
  const slideNumber = Math.min(slideCount, Math.max(1, index + 1))
  return `/apresentacao/${slideNumber}`
}
