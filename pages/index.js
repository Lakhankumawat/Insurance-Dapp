import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bulma/css/bulma.min.css';
export default function Home() {
  const styling = {
    backgroundImage: `url('./bc1.png')`,
    width: "1000px",
    height: "1000px",
  };
  return (
    <div>
      {/* <Image
        className={styles.image}
        alt="travel"
        src="/bc1.png"
        layout="fill"
        objectFit="cover"
        quality={100}
      /> */}
      <video autoPlay loop muted className='w-full h-screen z-10' style={{ position: 'relative', zIndex: '10', width: '100%', height: '100%' }}>
        <source src='/video.mp4' type='video/mp4' />
      </video>
      <div className="container" style={{ position: 'absolute', top: '8%', left: '12%', zIndex: '101' }}>
        <div className="row">
          <div className="col-sm">
            {/* <div className={styles.landregcard}> */}
            <div className={styles.landregsystemtext}>
              "The Wave"
            </div>
            {/* </div> */}

            {/* <div className={styles.getstartedcard}>
              <div className={styles.getstartedtext}><a href="/company" style={{ textDecoration: 'none' }}>Get Started</a></div>
            </div> */}
            <a href="/company" style={{ marginLeft: '10%' }}>
              <button class="button is-primary">COMPANY</button>
            </a>
            <a href="/user" style={{ marginLeft: '10%' }}>
              <button class="button is-primary">USER</button>
            </a>
            <a href="/miner" style={{ marginLeft: '10%' }}>
              <button class="button is-primary">MINER</button>
            </a>

          </div>
          <div className="col-sm">
            {/* <div className={styles.descripcard}> */}
            <Image
              className={styles.imageBlock}
              alt="travel"
              src="/trans_bg.png"
              width={600}
              height={600}
              quality={100}
            />
            {/* </div> */}
            {/* <Image
              className={styles.imageBlock}
              alt="travel"
              src="/block.jpg"
              width={600}
              height={400}
              quality={100}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
