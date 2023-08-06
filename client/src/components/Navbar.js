import React from 'react'

export default function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid py-2">
                    <div className="company-name px-2">
                        FE Task
                    </div>

                    <div className="user-icon px-2" >
                        Username
                    </div>
                </div>
            </nav>
        </div>
    )
}
