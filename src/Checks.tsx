import React, { useEffect, useState } from "react";
import styles from "./Checks.module.css";
import "./styles.css"
import Button from "./Button"
import Loader from "./Loader"
import {submitCheckResults, fetchChecks} from "./api"
import {
  useQuery,
} from '@tanstack/react-query'

export interface Check {
  id: string,
  priority: number,
  description: string,
  choice?: string,
  disabled?: boolean
}

export default function Checks() {
  const [checks, setChecks] = useState<Check[]>()
  const [ready, setReady] = useState<boolean>(false)
  const [active, setActive] = useState<string>()
  const [sent, setSent] = useState<boolean | string>()
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchChecks,
  })



  let moveKeys

  useEffect(() => {
    let moveKeys = 
      (e: React.KeyboardEvent | KeyboardEvent): void => {
      let disable = false
      if (checks && active) {
        let currentCheck = checks.map((e: Check) => e.id).indexOf(active)
        if (e.key === "ArrowDown") {
          if (checks[currentCheck].choice && checks[currentCheck].choice !== "no" && currentCheck !== checks.length -1) {
            setActive(checks[currentCheck + 1].id)
          }
        } else if (e.key === "ArrowUp") {
          if (currentCheck !== 0) {
            setActive(checks[currentCheck - 1].id)
          }
        } else if (e.key === "ArrowRight" || e.key === "2") {
          let checkCopy = checks.slice()
          checkCopy = checkCopy.map(check => {
            if (check.id === active) {
              disable = true
              return {...check, choice: "no"}
            }
            if (disable) {
              return {...check, disabled: true}
            }
            return check
          })
          setChecks(checkCopy)
        } else if (e.key === "ArrowLeft" || e.key === "1") {
          let checkCopy = checks.slice()
          checkCopy = checkCopy.map(check => {
            if (check.id === active) {
              disable = true
              if (checks.length-1 !== currentCheck) {
                setActive(checks[currentCheck + 1].id)
              }
              return {...check, choice: "yes"}
            }
            if (disable && !checks[currentCheck].choice) {
              disable = false
              return {...check, disabled: false}
            } else if (disable){
              return {...check, disabled: false}
            }
            return check
          })
          setChecks(checkCopy)
        }
      }
    }
    window.addEventListener('keydown', moveKeys)
    return (() => {
      window.removeEventListener('keydown', moveKeys)
    })
  })

  useEffect(() => {
    if (!checks && data) {
      const fetchData = async () => {
        let newChecks = []
        newChecks = data.sort((a: Check,b: Check) => a.priority - b.priority)
        .map((check: Check, i: number) => {
          if (i === 0) {
            return {...check, choice: "", disabled: false}
          }
          return {...check, choice: "", disabled: true}
        })
        setActive(newChecks[0].id)
        setChecks(newChecks)
      }
      fetchData()
    }
    if (checks) {
      if (checks.some(i => i.choice === "no")) {
        setReady(true)
      } else if (checks.every(i => i.choice)) {
        setReady(true)
      } else {
        setReady(false)
      }
    }
  }, [checks, data])

  const onSelect = (check: Check, choice: boolean) => {
    if (checks && active) {
      let currentCheck = checks.map((e: Check) => e.id).indexOf(active)
      let checkCopy: Check[] = checks.slice()
      let disable = false
      if (choice) {
        checkCopy = checkCopy.map(checkMap => {
          if (checkMap.id === check.id) {
            if (checkCopy.length - 1 !== currentCheck) {
              setActive(checks[currentCheck + 1].id)
            }
            disable = true
            return {...checkMap, choice: "yes", disabled: false}
          }
          if (disable && !checkCopy[currentCheck + 1].choice) {
            disable = false
            return {...checkMap, disabled: false}
          } else if (disable) {
            return {...checkMap, disabled: false}
          }
          return checkMap
        })
      } else {
        checkCopy = checkCopy.map(checkMap => {
          if (checkMap.id === check.id) {
            disable = true
            setActive(checkMap.id)
            return {...checkMap, choice: "no"}
          }
          if (disable) {
            return {...checkMap, disabled: true}
          }
          return checkMap
        })
      }
      setChecks(checkCopy)
    }
  }

  const submitChecks = () => {
    if (checks) {
      submitCheckResults(checks).then(() => setSent(true)).catch(() => setSent("error"))
    }
  }

  if (!sent) {
    return (
      <div className="App" onKeyDown={moveKeys}>
        {isLoading ? null : isError ? `Error: ${error}` : checks && checks.map((check, i) => {
          return (
            <div className={check.id === active ? `${styles.check} ${styles.active}` : i === 0 ? `${styles.check}` : !check.disabled ? `${styles.check}` : `${styles.disabled}`} key={check.id}>
              <h4>{check.description}</h4>
              <Button choice="yes" selected={check.choice} onClick={() => onSelect(check, true)} style={check.choice === "yes" && check.disabled ? {border: "2px solid gray", backgroundColor: "gray"} : check.disabled ? {border: "2px solid gray", color: "gray"} : {}}>Yes</Button>
              <Button choice="no" selected={check.choice} onClick={() => onSelect(check, false)} style={check.choice === "no" && check.disabled ? {border: "2px solid gray", backgroundColor: "gray"} : check.disabled ? {border: "2px solid gray", color: "gray", borderLeft: "none"} : {}}>No</Button>
            </div>
          )
        })}
        <div className={styles.submit}>
          {isLoading ? <Loader /> : ready ? <Button role="submit" onClick={submitChecks}>Submit</Button> : <Button role="submit" disabled={true}>Submit</Button>}
        </div>
      </div>);
  } else if (sent === "error"){
    return (
      <div className="App" onKeyDown={moveKeys}>
        {isLoading ? null : isError ? `Error: ${error}` : checks && checks.map((check, i) => {
          return (
            <div className={check.id === active ? `${styles.check} ${styles.active}` : i === 0 ? `${styles.check}` : !check.disabled ? `${styles.check}` : `${styles.disabled}`} key={check.id}>
              <h4>{check.description}</h4>
              <Button choice="yes" selected={check.choice} onClick={() => onSelect(check, true)} style={check.choice === "yes" && check.disabled ? {border: "2px solid gray", backgroundColor: "gray"} : check.disabled ? {border: "2px solid gray", color: "gray"} : {}}>Yes</Button>
              <Button choice="no" selected={check.choice} onClick={() => onSelect(check, false)} style={check.choice === "no" && check.disabled ? {border: "2px solid gray", backgroundColor: "gray"} : check.disabled ? {border: "2px solid gray", color: "gray", borderLeft: "none"} : {}}>No</Button>
            </div>
          )
        })}
        <div className={styles.submit}>
          {isLoading ? <Loader /> : ready ? <Button role="submit" onClick={submitChecks}>Submit</Button> : <Button role="submit" disabled={true}>Submit</Button>}
        </div>
        <div className={styles.error}>There was a problem. Please try again.</div>
      </div>);
  } else {
    return (
      <div className="App" >
        <h1 className={styles.success}>Success!</h1>
      </div>
    )
  }
}
