DROP PROCEDURE IF EXISTS up_multipleDistribution();
CREATE OR REPLACE PROCEDURE up_multipleDistribution(
	productid IN text,
	mainstockid IN text,
	amount IN numeric,
	isdone INOUT boolean,
	messageexc INOUT character varying
)
LANGUAGE 'plpgsql'
AS $$
DECLARE
	isExisted integer;
	prod_id uuid;
	main uuid;
	quantity numeric;
	emp record;
BEGIN
	prod_id := productID;
	main := mainstockID;
	quantity := amount;
	FOR emp IN SELECT A.branchid FROM branch A WHERE A.branchid <> main
	LOOP
		BEGIN
			SELECT COUNT(*) INTO isExisted FROM stock B 
								   		   WHERE B.productid = prod_id
								   		   AND B.branchid = emp.branchid;
		IF isExisted <= 0 THEN
			INSERT INTO stock VALUES (nextval('stock_id_seq'::regclass),quantity, quantity, emp.branchid, prod_id);
		ELSE
			UPDATE stock C SET totalamount = totalamount + quantity, remaining = remaining + quantity
						where C.productid = prod_id
						and C.branchid = emp.branchid;
		END IF;
		UPDATE stock D SET remaining = remaining - quantity
						where D.productid = prod_id
						and D.branchid = main;
		isDone := 'true';
		messageexc := 'Multiple distribution successfully';
	END;
  END LOOP;
END;
$$;

CALL up_multipleDistribution('bbd80c26-25d6-4916-9aaf-81813a2c53d2', 'c054bcf9-9429-4030-890d-e7ceddd9e813', 1, null, null);