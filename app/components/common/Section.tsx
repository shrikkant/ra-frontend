import React from "react";


interface SectionProps {
  title: string;
  tags?: React.ReactNode[];
  actions?: React.ReactNode[];
  children?: React.ReactNode;
}

export function Section({ title, tags, actions, children }: SectionProps) {


  return (
    <div className="border border-gray-300 rounded-md my-4">
      <div className="flex font-semibold gap-x-4 bg-gray-200 p-2 items-center">
        <div className="text-nowrap">{title}</div>
        <div className="flex justify-between items-center gap-x-4 flex-aut">
          <div className="flex gap-x-4">
            {tags?.map((tag, key) =>
              <div key={key} className="font-normal">{tag}</div>
            )}
          </div>
          <div>
            {actions?.map((action, key) =>
              <div key={key} className="border font-semibold"> {action} </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {children}
      </div>
    </div>
  )

}
