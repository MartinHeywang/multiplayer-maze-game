import React, {FC} from 'react'

import "./scss/Card.scss";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const Card: FC<Props> = ({children, className = ""}) => {
  return (
    <div className={`Card ${className}`}>{children}</div>
  )
}

export default Card