import Opening from './sections/opening/Opening'
import Challenge from './sections/Challenge'
import Solution from './sections/Solution'
import Architecture from './sections/Architecture'
import Technologies from './sections/Technologies'
import Portability from './sections/Portability'
import ProjectDefense from './sections/ProjectDefense'
import './home.css'

export default function HomePage() {
  return (
    <>
      <Opening />
      <Challenge />
      <Solution />
      <Architecture />
      <Technologies />
      <Portability />
      <ProjectDefense />
    </>
  )
}
